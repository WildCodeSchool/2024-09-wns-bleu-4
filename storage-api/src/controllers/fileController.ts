import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

export const uploadFile = (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ message: 'Aucun fichier envoyé' });
        return;
    }

    // Log de l'action d'upload avec l'utilisateur
    console.log(`Upload de fichier par ${req.user?.email}: ${req.file.filename}`);

    res.json({
        message: 'Fichier uploadé avec succès !',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`, // Chemin vers la route sécurisée
        uploadedBy: req.user?.email
    });
};

export const deleteFile = (req: Request, res: Response): void => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(uploadDir, filename);

    // Log de l'action de suppression avec l'utilisateur
    console.log(`Suppression de fichier par ${req.user?.email}: ${filename}`);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Erreur lors de la suppression: ${err.message}`, {
                path: filePath,
                error: err,
                user: req.user?.email
            });
            res.status(500).json({
                message: 'Erreur lors de la suppression du fichier',
                details: err.message,
                filename,
            });
            return;
        }
        res.json({ 
            message: 'Fichier supprimé avec succès', 
            filename,
            deletedBy: req.user?.email
        });
    });
};

export const getFiles = (req: Request, res: Response): void => {
    // Log de la consultation des fichiers avec l'utilisateur
    console.log(`Consultation des fichiers par ${req.user?.email}`);

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error(`Erreur lors de la lecture des fichiers par ${req.user?.email}:`, err);
            res.status(500).json({ message: 'Erreur lors de la lecture des fichiers' });
            return;
        }
        res.json({ 
            files,
            requestedBy: req.user?.email
        });
    });
};
