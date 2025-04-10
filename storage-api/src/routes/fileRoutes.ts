import 'dotenv';
import express from 'express';
import {
    deleteFile,
    getFiles,
    uploadFile,
} from '../controllers/fileController.ts';
import upload from '../middlewares/multerConfig.ts';

const router = express.Router();

const getDockerPrefix = () => {
    return process.env.IS_DOCKER ? '/storage' : '';
};

// @ts-expect-error
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/files', getFiles);

export default router;
