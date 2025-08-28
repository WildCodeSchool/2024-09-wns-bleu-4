import express from 'express';
import {
    uploadTempFile,
    getTempFile,
    getTempFileInfo,
    cleanupAllExpiredFiles
} from '../controllers/tempFileController';
import { manualCleanup } from '../services/cleanupService';
import upload from '../middlewares/multerConfig';

const tempFileRoutes = express.Router();

// Clean up expired files on startup
cleanupAllExpiredFiles();

// Public routes for temporary files (no authentication required)
tempFileRoutes.post('/temp/upload', upload.single('file'), uploadTempFile);
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
