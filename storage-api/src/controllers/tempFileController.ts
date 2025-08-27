import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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

export const uploadTempFile = (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    try {
        const tempId = uuidv4();
        const originalName = req.file.originalname;
        const fileSize = req.file.size;
        const createdAt = new Date();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Generate a unique filename for the temp directory
        const fileExtension = path.extname(originalName);
        const tempFilename = `${tempId}${fileExtension}`;
        
        // Move file from default uploads to temp directory
        const sourcePath = path.join(__dirname, '../../uploads', req.file.filename);
        const destPath = path.join(tempUploadDir, tempFilename);
        
        // Ensure the file exists in source before moving
        if (!fs.existsSync(sourcePath)) {
            res.status(500).json({ message: 'Uploaded file not found in source directory' });
            return;
        }
        
        // Move the file to temp directory
        fs.renameSync(sourcePath, destPath);

        // Create temp link record
        const tempLink: TempLink = {
            id: tempId,
            filename: tempFilename,
            originalName,
            fileSize,
            createdAt,
            expiresAt,
            accessCount: 0
        };

        // Save temp link to file
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        tempLinks.push(tempLink);
        fs.writeFileSync(tempLinksFile, JSON.stringify(tempLinks, null, 2));

        // Schedule cleanup
        setTimeout(() => {
            cleanupExpiredFile(tempId);
        }, 24 * 60 * 60 * 1000);

        console.log(`Temporary file uploaded: ${originalName} -> ${tempId} (${tempFilename})`);

        res.json({
            message: 'Temporary file uploaded successfully!',
            tempId,
            originalName,
            fileSize,
            expiresAt,
            accessUrl: `/temp/${tempId}`
        });
    } catch (error) {
        console.error('Error uploading temporary file:', error);
        res.status(500).json({ message: 'Error uploading temporary file' });
    }
};

export const getTempFile = (req: Request, res: Response): void => {
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
            // Remove expired link
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

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${tempLink.originalName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', tempLink.fileSize);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        console.log(`Temporary file accessed: ${tempId} (${tempLink.originalName})`);
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
            timeRemaining: new Date(tempLink.expiresAt).getTime() - Date.now()
        });
    } catch (error) {
        console.error('Error getting temporary file info:', error);
        res.status(500).json({ message: 'Error getting temporary file info' });
    }
};

const cleanupExpiredFile = (tempId: string): void => {
    try {
        const tempLinks = JSON.parse(fs.readFileSync(tempLinksFile, 'utf8'));
        const tempLink = tempLinks.find((link: TempLink) => link.id === tempId);
        
        if (tempLink) {
            // Remove file from disk
            const filePath = path.join(tempUploadDir, tempLink.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Removed file: ${filePath}`);
            }

            // Remove from temp links
            const updatedLinks = tempLinks.filter((link: TempLink) => link.id !== tempId);
            fs.writeFileSync(tempLinksFile, JSON.stringify(updatedLinks, null, 2));

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
        const validLinks = tempLinks.filter((link: TempLink) => new Date(link.expiresAt) > now);
        
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
            fs.writeFileSync(tempLinksFile, JSON.stringify(validLinks, null, 2));
            console.log(`Cleaned up ${tempLinks.length - validLinks.length} expired temporary files`);
        }
    } catch (error) {
        console.error('Error cleaning up expired files:', error);
    }
};
