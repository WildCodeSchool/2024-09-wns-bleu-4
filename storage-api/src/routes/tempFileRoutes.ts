import express from 'express';
import {
    uploadTempFile,
    getTempFile,
    getTempFileInfo,
    cleanupAllExpiredFiles
} from '../controllers/tempFileController';
import upload from '../middlewares/multerConfig';

const tempFileRoutes = express.Router();

// Clean up expired files on startup
cleanupAllExpiredFiles();

// Public routes for temporary files (no authentication required)
tempFileRoutes.post('/temp/upload', upload.single('file'), uploadTempFile);
tempFileRoutes.get('/temp/:tempId', getTempFile);
tempFileRoutes.get('/temp/:tempId/info', getTempFileInfo);

export default tempFileRoutes;
