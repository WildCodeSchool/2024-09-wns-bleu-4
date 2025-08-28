import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempUploadDir = path.join(__dirname, '../../uploads/temp');
const tempLinksFile = path.join(__dirname, '../../temp-links.json');

interface TempLink {
    id: string;
    filename: string;
    originalName: string;
    fileSize: number;
    createdAt: Date;
    expiresAt: Date;
    accessCount: number;
}

/**
 * Clean up expired temporary files from storage
 */
const cleanupExpiredFiles = (): void => {
    try {
        if (!fs.existsSync(tempLinksFile)) {
            return;
        }

        const tempLinksData = fs.readFileSync(tempLinksFile, 'utf8');
        const tempLinks: TempLink[] = JSON.parse(tempLinksData);
        const now = new Date();
        
        // Find expired links
        const expiredLinks = tempLinks.filter(link => new Date(link.expiresAt) <= now);
        const validLinks = tempLinks.filter(link => new Date(link.expiresAt) > now);

        if (expiredLinks.length === 0) {
            return;
        }

        console.log(`Found ${expiredLinks.length} expired temporary files to clean up`);

        // Remove expired files from disk
        expiredLinks.forEach(link => {
            const filePath = path.join(tempUploadDir, link.filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Removed expired file: ${link.originalName} (${link.id})`);
                } catch (error) {
                    console.error(`Failed to remove expired file ${link.originalName}:`, error);
                }
            }
        });

        // Update temp links file to remove expired entries
        if (expiredLinks.length !== tempLinks.length) {
            fs.writeFileSync(tempLinksFile, JSON.stringify(validLinks, null, 2));
            console.log(`Updated temp-links.json: removed ${expiredLinks.length} expired entries`);
        }

        console.log(`Cleanup completed: ${expiredLinks.length} expired files removed`);
    } catch (error) {
        console.error('Error during cleanup of expired files:', error);
    }
};

/**
 * Start the cleanup service that runs every 5 minutes
 */
export const startCleanupService = (): void => {
    console.log('Starting cleanup service for expired temporary files...');
    
    // Run cleanup immediately on startup
    cleanupExpiredFiles();
    
    // Set up periodic cleanup every 5 minutes
    const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    
    setInterval(() => {
        cleanupExpiredFiles();
    }, CLEANUP_INTERVAL);
    
    console.log(`Cleanup service started. Will run every ${CLEANUP_INTERVAL / 1000 / 60} minutes.`);
};

/**
 * Manual cleanup function that can be called on demand
 */
export const manualCleanup = (): void => {
    console.log('Manual cleanup requested...');
    cleanupExpiredFiles();
};
