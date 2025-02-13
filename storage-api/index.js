import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Configuration de Multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
    },
});

const upload = multer({ storage: storage });

// Route pour uploader un fichier
app.post('/upload', upload.single('file'), (req, res) => {
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
});

// Page HTML pour l'upload (accéder à http://localhost:8080)
app.get('/', (req, res) => {
    res.send(`
        <h2>Uploader un fichier</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <button type="submit">Envoyer</button>
        </form>
    `);
});

// Démarrer le serveur
app.listen(8080, () => console.log('Serveur lancé sur http://localhost:8080'));
