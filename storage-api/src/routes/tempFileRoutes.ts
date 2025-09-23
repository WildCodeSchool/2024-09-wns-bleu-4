import express from 'express';
import {
    cleanupAllExpiredFiles,
    getTempFile,
    getTempFileInfo,
    uploadTempFile,
} from '../controllers/tempFileController';
import { tempUpload } from '../middlewares/multerConfig';
import { generalLimiter, tempUploadLimiter } from '../middlewares/rateLimiters';
import { manualCleanup } from '../services/cleanupService';

const tempFileRoutes = express.Router();

// Clean up expired files on startup
cleanupAllExpiredFiles();

// Appliquer les rate limiters aux routes publiques
tempFileRoutes.use('/temp/upload', tempUploadLimiter); // Limite les uploads temporaires
tempFileRoutes.use('/temp', generalLimiter); // Limite générale pour les autres routes temp

// Public routes for temporary files (no authentication required)
tempFileRoutes.post('/temp/upload', tempUpload.single('file'), uploadTempFile);
tempFileRoutes.get('/temp/:tempId', getTempFile);
tempFileRoutes.get('/temp/:tempId/info', getTempFileInfo);

// Admin route for manual cleanup (for testing/debugging)
tempFileRoutes.post('/temp/cleanup', (_req, res) => {
    try {
        manualCleanup();
        res.json({ message: 'Manual cleanup completed successfully' });
    } catch (error) {
        console.error('Error during manual cleanup:', error);
        res.status(500).json({ message: 'Error during manual cleanup' });
    }
});

export default tempFileRoutes;
