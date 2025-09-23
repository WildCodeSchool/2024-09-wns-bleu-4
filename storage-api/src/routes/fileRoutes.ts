import 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    deleteFile,
    getFiles,
    uploadFile,
} from '../controllers/fileController';
import { authMiddleware } from '../middlewares/authMiddleware';
import upload from '../middlewares/multerConfig';
import {
    deleteLimiter,
    generalLimiter,
    uploadLimiter,
} from '../middlewares/rateLimiters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Appliquer les rate limiters aux routes authentifiées
router.use('/upload', uploadLimiter); // Limite les uploads
router.use('/delete', deleteLimiter); // Limite les suppressions
router.use(generalLimiter); // Limite générale pour les autres routes

// Route sécurisée pour servir les fichiers uploadés
router.get('/uploads/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ message: 'Fichier non trouvé' });
        return;
    }

    // Log de l'accès au fichier
    console.log(`Accès au fichier par ${req.user?.email}: ${filename}`);

    // Servir le fichier
    res.sendFile(filePath);
});

// Routes accessibles aux utilisateurs authentifiés
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/files', getFiles);

export default router;
