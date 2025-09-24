import { LogType } from '@/entities/SystemLog';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import { registerEnumType } from 'type-graphql';
import fs from 'fs';
import path from 'path';

export enum ScanStatus {
    PENDING = 'pending',
    SCANNING = 'scanning',
    CLEAN = 'clean',
    INFECTED = 'infected',
    ERROR = 'error',
}

// Register the enum with TypeGraphQL
registerEnumType(ScanStatus, {
    name: 'ScanStatus',
    description: 'Status of antivirus scan',
});

export interface ScanResult {
    status: ScanStatus;
    analysisId?: string;
    scanDate?: Date;
    threatCount?: number;
    threats?: string[];
    error?: string;
}

export class AntivirusService {
    private static readonly VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;

    /**
     * Scan a file using VirusTotal API
     * @param filePath - Relative path to the file (from storage-api/uploads)
     * @param fileName - Name of the file for logging
     * @param userEmail - Email of the user uploading the file
     * @returns Promise<ScanResult>
     */
    static async scanFile(
        filePath: string,
        fileName: string,
        userEmail?: string,
        retryCount: number = 0,
    ): Promise<ScanResult> {
        try {
            // Check if API key is configured
            if (!this.VIRUSTOTAL_API_KEY) {
                const error = 'VirusTotal API key not configured';
                await this.logError('Antivirus scan failed', error, userEmail);
                return {
                    status: ScanStatus.ERROR,
                    error,
                };
            }

            // Construct the full file path
            // The filePath from database is like "/storage/uploads/filename.png"
            // In the backend container, this is mounted at /app/storage-uploads
            let fullFilePath: string;
            
            // Extract just the filename from the path
            // The path might be like "/storage/uploads/filename.png" or just "filename.png"
            let filename: string;
            
            // Get the basename (filename) from the path, regardless of the prefix
            filename = path.basename(filePath);
            
            // Use the mounted volume path in the backend container
            const uploadsDir = '/app/storage-uploads';
            fullFilePath = path.join(uploadsDir, filename);

            // Check if file exists
            if (!fs.existsSync(fullFilePath)) {
                // Try case-insensitive search
                const availableFiles = fs.readdirSync(uploadsDir);
                const foundFile = availableFiles.find(file => 
                    file.toLowerCase() === filename.toLowerCase()
                );
                
                if (foundFile) {
                    fullFilePath = path.join(uploadsDir, foundFile);
                } else {
                    // If file not found and we haven't retried yet, wait and retry
                    if (retryCount < 3) {
                        await this.logError('Antivirus scan retry', `File not found, retrying in 3 seconds (attempt ${retryCount + 1}/3)`, userEmail);
                        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
                        return this.scanFile(filePath, fileName, userEmail, retryCount + 1);
                    }
                    
                    const error = `File not found after ${retryCount + 1} attempts: ${fullFilePath}. Available files: ${availableFiles.join(', ')}`;
                    await this.logError('Antivirus scan failed', error, userEmail);
                    return {
                        status: ScanStatus.ERROR,
                        error,
                    };
                }
            }

            // Log scan start
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Antivirus scan started',
                `Starting antivirus scan for file: ${fileName}`,
                userEmail,
            );

            // Use public API as per VirusTotal documentation
            const analysisId = await this.submitToPublicAPI(fullFilePath);

            // Log successful submission
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'File submitted for scanning',
                `File "${fileName}" submitted to VirusTotal with analysis ID: ${analysisId}`,
                userEmail,
            );

            // Return initial result - the actual scan results will be available later
            return {
                status: ScanStatus.SCANNING,
                analysisId,
                scanDate: new Date(),
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.logError('Antivirus scan failed', errorMessage, userEmail);
            
            return {
                status: ScanStatus.ERROR,
                error: errorMessage,
            };
        }
    }

    /**
     * Submit file to VirusTotal public API (multipart/form-data)
     * https://docs.virustotal.com/reference/files-scan
     */
    private static async submitToPublicAPI(
        fullFilePath: string,
    ): Promise<string> {
        const fileName = path.basename(fullFilePath);
        
        // Debug logging
        console.log(`Submitting file to VirusTotal: ${fileName}, size: ${fs.statSync(fullFilePath).size} bytes`);

        try {
            // Build multipart body using standard Web FormData (Node 18+)
            // Important: pass a Blob with a filename so VT recognizes the 'file' part
            const fileBuffer = fs.readFileSync(fullFilePath);
            const blob = new Blob([new Uint8Array(fileBuffer)]);
            const formData = new FormData();
            formData.append('file', blob, fileName);

            // For files larger than 32MB, VirusTotal requires obtaining an upload URL first
            const fileSize = fs.statSync(fullFilePath).size;
            let uploadEndpoint = 'https://www.virustotal.com/api/v3/files';
            if (fileSize > 32 * 1024 * 1024) {
                const uploadUrlRes = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
                    method: 'GET',
                    headers: { 'x-apikey': this.VIRUSTOTAL_API_KEY! },
                });
                if (!uploadUrlRes.ok) {
                    const t = await uploadUrlRes.text();
                    throw new Error(`Failed to get upload URL: ${uploadUrlRes.status} ${uploadUrlRes.statusText} - ${t}`);
                }
                const uploadUrlJson: any = await uploadUrlRes.json();
                if (uploadUrlJson?.data) uploadEndpoint = uploadUrlJson.data as string;
            }

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                headers: {
                    'x-apikey': this.VIRUSTOTAL_API_KEY!,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`VirusTotal public API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data: any = await response.json();
            const analysisId = data?.data?.id as string | undefined;
            if (!analysisId) throw new Error('No analysis ID returned from VirusTotal public API');
            return analysisId;
        } catch (error) {
            let errorMessage = 'VirusTotal API error';
            
            if (error instanceof Error) {
                errorMessage = `VirusTotal API error: ${error.message}`;
            }
            
            throw new Error(errorMessage);
        }
    }

    /**
     * Check the status of a previously submitted scan
     * @param analysisId - The analysis ID returned from the initial scan
     * @param fileName - Name of the file for logging
     * @param userEmail - Email of the user
     * @returns Promise<ScanResult>
     */
    static async checkScanStatus(
        analysisId: string,
        fileName: string,
        userEmail?: string,
    ): Promise<ScanResult> {
        try {
            if (!this.VIRUSTOTAL_API_KEY) {
                const error = 'VirusTotal API key not configured';
                await this.logError('Antivirus status check failed', error, userEmail);
                return {
                    status: ScanStatus.ERROR,
                    error,
                };
            }

            // Use direct fetch to check analysis status (not available in local API package)
            const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                method: 'GET',
                headers: {
                    'x-apikey': this.VIRUSTOTAL_API_KEY!,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`VirusTotal API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const analysis = data.data.attributes;

            // Check if scan is still in progress
            if (analysis.status === 'queued' || analysis.status === 'in-progress') {
                return {
                    status: ScanStatus.SCANNING,
                    analysisId,
                    scanDate: new Date(analysis.date * 1000),
                };
            }

            // Scan completed - check results
            if (analysis.status === 'completed') {
                const stats = analysis.stats;
                const threatCount = stats.malicious + stats.suspicious;

                if (threatCount > 0) {
                    // File is infected
                    const threats: string[] = [];
                    
                    // Extract threat names from scan results
                    if (analysis.results) {
                        Object.entries(analysis.results).forEach(([engine, result]: [string, any]) => {
                            if (result.category === 'malicious' || result.category === 'suspicious') {
                                threats.push(`${engine}: ${result.result || 'Threat detected'}`);
                            }
                        });
                    }

                    await SystemLogResolver.logEvent(
                        LogType.ERROR,
                        'Malicious file detected',
                        `File "${fileName}" detected as malicious by ${threatCount} engines`,
                        userEmail,
                    );

                    return {
                        status: ScanStatus.INFECTED,
                        analysisId,
                        scanDate: new Date(analysis.date * 1000),
                        threatCount,
                        threats,
                    };
                } else {
                    // File is clean
                    await SystemLogResolver.logEvent(
                        LogType.SUCCESS,
                        'File scan completed - Clean',
                        `File "${fileName}" scanned successfully and found clean`,
                        userEmail,
                    );

                    return {
                        status: ScanStatus.CLEAN,
                        analysisId,
                        scanDate: new Date(analysis.date * 1000),
                        threatCount: 0,
                    };
                }
            }

            // Unknown status
            return {
                status: ScanStatus.ERROR,
                analysisId,
                error: `Unknown scan status: ${analysis.status}`,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.logError('Antivirus status check failed', errorMessage, userEmail);
            
            return {
                status: ScanStatus.ERROR,
                analysisId,
                error: errorMessage,
            };
        }
    }

    /**
     * Helper method to log errors
     */
    private static async logError(
        action: string,
        error: string,
        userEmail?: string,
    ): Promise<void> {
        try {
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                action,
                error,
                userEmail,
            );
        } catch (logError) {
            console.error('Failed to log antivirus error:', logError);
        }
    }
}
