import { Request, Response } from 'express';
import fs from 'fs';
import md5File from 'md5-file';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getMimeType } from '../middlewares/multerConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempUploadDir = path.join(__dirname, '../../uploads/temp');
const tempLinksFile = path.join(__dirname, '../../temp-links.json');

// Ensure temp directory exists
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}

// Ensure temp links file exists
if (!fs.existsSync(tempLinksFile)) {
    fs.writeFileSync(tempLinksFile, JSON.stringify([]));
}

interface TempLink {
    id: string;
    filename: string;
    originalName: string;
    fileSize: number;
    createdAt: Date;
    expiresAt: Date;
    accessCount: number;
}

export const uploadTempFile = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    try {
        const tempId = uuidv4();
        const originalName = req.file.originalname;
        const fileSize = req.file.size;
        const createdAt = new Date();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        // Le fichier est déjà dans le répertoire temp avec un nom unique généré par multer
        const tempFilename = req.file.filename;

        // Vérifier que le fichier existe dans le répertoire temp
        const filePath = path.join(tempUploadDir, tempFilename);
        if (!fs.existsSync(filePath)) {
            res.status(500).json({
                message: 'Uploaded file not found in temp directory',
            });
            return;
        }

        // Compute MD5 hash of the temporary file
        const md5Hash = await md5File(filePath);

        // Create temp link record
        const tempLink: TempLink = {
            id: tempId,
            filename: tempFilename,
            originalName,
            fileSize,
            createdAt,
            expiresAt,
            accessCount: 0,
        };

        // Save temp link to file
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        tempLinks.push(tempLink);
        fs.writeFileSync(tempLinksFile, JSON.stringify(tempLinks, null, 2));

        console.log(
            `Temporary file uploaded: ${originalName} -> ${tempId} (${tempFilename})`,
        );
        console.log(`File will expire at: ${expiresAt.toISOString()}`);

        res.json({
            message: 'Temporary file uploaded successfully!',
            tempId,
            originalName,
            fileSize,
            md5Hash,
            expiresAt,
            accessUrl: `/temp/${tempId}`,
        });
    } catch (error) {
        console.error('Error uploading temporary file:', error);
        res.status(500).json({ message: 'Error uploading temporary file' });
    }
};

export const getTempFile = (req: Request, res: Response): void => {
    const tempId = req.params.tempId;
    const forceDownload = req.query.download === 'true';

    try {
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        const tempLink = tempLinks.find((link: TempLink) => link.id === tempId);

        if (!tempLink) {
            res.status(404).json({ message: 'Temporary link not found' });
            return;
        }

        // Check if expired
        if (new Date() > new Date(tempLink.expiresAt)) {
            // Remove expired link and file immediately
            cleanupExpiredFile(tempId);
            res.status(410).json({ message: 'Temporary link has expired' });
            return;
        }

        // Update access count
        tempLink.accessCount++;
        fs.writeFileSync(tempLinksFile, JSON.stringify(tempLinks, null, 2));

        // Serve the file
        const filePath = path.join(tempUploadDir, tempLink.filename);

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Determine content type based on file extension
        const fileExtension = path.extname(tempLink.originalName).toLowerCase();
        let contentType = 'application/octet-stream'; // Default fallback

        // Get MIME type from extension using centralized function
        const mimeType = getMimeType(fileExtension);
        if (mimeType) {
            contentType = mimeType;
        }

        // Set appropriate headers for browser display
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', tempLink.fileSize);

        // Determine how to serve the file
        let contentDisposition: string;

        if (forceDownload) {
            // Force download if requested
            contentDisposition = `attachment; filename="${tempLink.originalName}"`;
        } else {
            // For certain file types, we want to display in browser
            // For others (like executables, archives), we might want to download
            const browserDisplayableTypes = [
                'text/',
                'image/',
                'video/',
                'audio/',
                'application/pdf',
                'application/json',
                'application/xml',
                'text/html',
                'text/css',
            ];

            const shouldDisplayInBrowser = browserDisplayableTypes.some(
                (type) => contentType.startsWith(type),
            );

            if (shouldDisplayInBrowser) {
                // Display in browser
                contentDisposition = `inline; filename="${tempLink.originalName}"`;
            } else {
                // Force download for potentially dangerous or non-displayable files
                contentDisposition = `attachment; filename="${tempLink.originalName}"`;
            }
        }

        res.setHeader('Content-Disposition', contentDisposition);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        const action = contentDisposition.startsWith('inline')
            ? 'displayed'
            : 'downloaded';
        console.log(
            `Temporary file ${action}: ${tempId} (${tempLink.originalName}) - Content-Type: ${contentType}`,
        );
    } catch (error) {
        console.error('Error serving temporary file:', error);
        res.status(500).json({ message: 'Error serving temporary file' });
    }
};

export const getTempFileInfo = (req: Request, res: Response): void => {
    const tempId = req.params.tempId;

    try {
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        const tempLink = tempLinks.find((link: TempLink) => link.id === tempId);

        if (!tempLink) {
            res.status(404).json({ message: 'Temporary link not found' });
            return;
        }

        // Check if expired
        if (new Date() > new Date(tempLink.expiresAt)) {
            cleanupExpiredFile(tempId);
            res.status(410).json({ message: 'Temporary link has expired' });
            return;
        }

        res.json({
            id: tempLink.id,
            originalName: tempLink.originalName,
            fileSize: tempLink.fileSize,
            createdAt: tempLink.createdAt,
            expiresAt: tempLink.expiresAt,
            accessCount: tempLink.accessCount,
            timeRemaining: new Date(tempLink.expiresAt).getTime() - Date.now(),
        });
    } catch (error) {
        console.error('Error getting temporary file info:', error);
        res.status(500).json({ message: 'Error getting temporary file info' });
    }
};

/**
 * Clean up a specific expired file
 * This function is called when accessing expired files or can be called manually
 */
const cleanupExpiredFile = (tempId: string): void => {
    try {
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        const tempLink = tempLinks.find((link: TempLink) => link.id === tempId);

        if (tempLink) {
            // Remove file from disk
            const filePath = path.join(tempUploadDir, tempLink.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Removed expired file: ${filePath}`);
            }

            // Remove from temp links
            const updatedLinks = tempLinks.filter(
                (link: TempLink) => link.id !== tempId,
            );
            fs.writeFileSync(
                tempLinksFile,
                JSON.stringify(updatedLinks, null, 2),
            );

            console.log(`Cleaned up expired temporary file: ${tempId}`);
        }
    } catch (error) {
        console.error('Error cleaning up expired file:', error);
    }
};

// Cleanup expired files on startup
export const cleanupAllExpiredFiles = (): void => {
    try {
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        const now = new Date();
        const validLinks = tempLinks.filter(
            (link: TempLink) => new Date(link.expiresAt) > now,
        );

        if (validLinks.length !== tempLinks.length) {
            // Remove expired files from disk
            tempLinks.forEach((link: TempLink) => {
                if (new Date(link.expiresAt) <= now) {
                    const filePath = path.join(tempUploadDir, link.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`Removed expired file: ${filePath}`);
                    }
                }
            });

            // Update temp links file
            fs.writeFileSync(
                tempLinksFile,
                JSON.stringify(validLinks, null, 2),
            );
            console.log(
                `Cleaned up ${
                    tempLinks.length - validLinks.length
                } expired temporary files`,
            );
        }
    } catch (error) {
        console.error('Error cleaning up expired files:', error);
    }
};
