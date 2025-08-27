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
import upload from '../middlewares/multerConfig';
import { authMiddleware } from '../middlewares/authMiddleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

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
