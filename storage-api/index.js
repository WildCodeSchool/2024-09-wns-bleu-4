import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url); // converti l'URL du fichier, donne le chemin complet du fichier
const __dirname = dirname(__filename); // donne le chemin du répertoiren, dans lequel se trouve le fichier

const app = express();

// Middleware pour servir les fichiers statiques (public et uploads)
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: 'uploads/', // Définir le dossier où les fichiers seront enregistrés
    filename: (req, file, cb) => {
        // Générer un nom unique pour éviter les conflits
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
    },
});

//Stratégie de stockage multer
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

// Route pour delete un fichier
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Erreur lors de la suppression du fichier' });
        }
        res.json({ message: 'Fichier supprimé avec succès' });
    });
});

// Route pour retourner une page HTML pour l'upload (accéder à http://localhost:8080)
app.get('/', (req, res) => {
    res.send(`
        <h2>Uploader un fichier</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" id="fileInput" required>
            <br>
            <img id="preview" src="" alt="Aperçu" style="display:none; max-width:200px; margin-top:10px;">
            <br>
            <button type="submit">Envoyer</button>
        </form>
        <hr>
        <a href="/files">Voir les fichiers stockés</a>
        
        <script>
            document.getElementById('fileInput').addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('preview');
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        </script>
    `);
});

// Route pour retourner une page HTML pour afficher la liste des fichiers uploads
app.get('/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Erreur lors de la lecture des fichiers' });
        }

        res.send(`
            <h2>Fichiers disponibles</h2>
            <ul style="list-style-type: none; padding: 0;">
                ${files
                    .map((file) => {
                        const ext = path.extname(file).toLowerCase();
                        let preview = '';
                        if (
                            ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(
                                ext,
                            )
                        ) {
                            preview = `<img src="/uploads/${file}" style="max-width: 100px; display: block; margin-top: 5px;">`;
                        } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
                            preview = `<video src="/uploads/${file}" controls style="max-width: 100px; display: block; margin-top: 5px;"></video>`;
                        } else if (['.mp3', '.wav', '.ogg'].includes(ext)) {
                            preview = `<audio controls style="display: block; margin-top: 5px;"><source src="/uploads/${file}" type="audio/${ext.slice(1)}"></audio>`;
                        } else {
                            preview = `<a href="/uploads/${file}" target="_blank" style="color: blue; text-decoration: underline;">Télécharger</a>`;
                        }

                        return `<li style="margin-bottom: 15px;">
                                    <strong>${file}</strong><br>
                                    ${preview}
                                    <br>
                                    <button onclick="deleteFile('${file}')" style="margin-top:5px;">Supprimer</button>
                                </li>`;
                    })
                    .join('')}
            </ul>
            <hr>
            <a href="/">Retour à l'upload</a>
            <script>
                function deleteFile(filename) {
                    fetch('/delete/' + filename, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            window.location.reload();
                        })
                        .catch(error => console.error('Erreur:', error));
                }
            </script>
        `);
    });
});

//Démarrage du serveur
const PORT = 8080;
app.listen(PORT, () =>
    console.log(`Serveur lancé sur http://localhost:${PORT}`),
);
