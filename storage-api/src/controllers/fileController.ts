import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    res.json({
        message: 'Fichier uploadé avec succès !',
        filename: req.file.filename,
        path: `/storage/uploads/${req.file.filename}`,
    });
};

export const deleteFile = (req: Request, res: Response) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Erreur lors de la suppression: ${err.message}`, {
                path: filePath,
                error: err,
            });
            return res.status(500).json({
                message: 'Erreur lors de la suppression du fichier',
                details: err.message,
                filename,
            });
        }
        res.json({ message: 'Fichier supprimé avec succès', filename });
    });
};

export const getFiles = (req: Request, res: Response) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Erreur lors de la lecture des fichiers' });
        }
        res.json({ files });
    });
};
