import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

export const uploadFile = (req: Request, res: Response) => {
    console.log('Requête reçue :', req.body);
    console.log('Fichier reçu :', req.file);

    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    res.json({
        message: 'Fichier uploadé avec succès !',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
    });
};

export const deleteFile = (req: Request, res: Response) => {
    const filePath = path.join(uploadDir, req.params.filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Erreur lors de la suppression du fichier' });
        }
        res.json({ message: 'Fichier supprimé avec succès' });
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
