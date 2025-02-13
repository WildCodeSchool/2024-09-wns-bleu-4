import express from 'express';
import multer from 'multer';

const app = express();

// Configuration de Multer (Multer crée le dossier "uploads" automatiquement si absent)
const upload = multer({ dest: 'uploads/' });

// Route pour uploader un fichier
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    res.json({
        message: 'Fichier uploadé avec succès !',
        filename: req.file.filename
    });
});

// Démarrer le serveur
app.listen(8080, () => console.log('Serveur lancé sur http://localhost:8080'));