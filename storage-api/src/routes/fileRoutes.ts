import 'dotenv';
import express from 'express';
import {
    deleteFile,
    getFiles,
    uploadFile,
} from '../controllers/fileController';
import upload from '../middlewares/multerConfig';

const router = express.Router();

// @ts-expect-error
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/files', getFiles);

export default router;
