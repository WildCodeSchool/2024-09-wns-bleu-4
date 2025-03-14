import express from 'express';
import {
    uploadFile,
    deleteFile,
    getFiles,
} from '../controllers/fileController.ts';
import upload from '../middlewares/multerConfig.ts';

const router = express.Router();

// Pour afficher la page HTML d'upload et des fichiers stockés
router.get('/', (req, res) => {
    res.send(`
        <h2>Uploader un fichier</h2>
        <form id="uploadForm" enctype="multipart/form-data">
            <input type="file" name="file" id="fileInput" required>
            <br>
            <img id="preview" src="" alt="Aperçu" style="display:none; max-width:200px; margin-top:10px;">
            <br>
            <button type="submit">Envoyer</button>
        </form>

        <h3>Fichiers stockés :</h3>
        <ul id="fileList" style="list-style-type: none; padding: 0;"></ul>

        <script>
            // ✅ Prévisualisation de l'image avant l'upload
            document.getElementById("fileInput").addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById("preview");
                        preview.src = e.target.result;
                        preview.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                }
            });

            document.getElementById("uploadForm").addEventListener("submit", async function(event) {
                event.preventDefault(); // 🚀 Empêche la redirection
                const formData = new FormData();
                const fileInput = document.getElementById("fileInput");

                if (!fileInput.files.length) {
                    alert("Veuillez sélectionner un fichier.");
                    return;
                }

                formData.append("file", fileInput.files[0]);

                try {
                    const response = await fetch("/storage/upload", {
                        method: "POST",
                        body: formData
                    });
                    const data = await response.json();
                    alert(data.message); // ✅ Confirmation de l'upload
                    fetchFiles(); // 🔄 Rafraîchir la liste après l'upload
                } catch (error) {
                    console.error("Erreur lors de l'upload :", error);
                }
            });

            async function fetchFiles() {
                try {
                    const response = await fetch("/storage/files");
                    const data = await response.json();
                    const fileList = document.getElementById("fileList");
                    fileList.innerHTML = "";

                    data.files.forEach(file => {
                        const ext = file.split('.').pop().toLowerCase();
                        let preview = '';

                        // ✅ Vérifie si c'est une image pour afficher un aperçu
                        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                            preview = \`<img src="/storage/uploads/\${file}" style="max-width: 100px; display: block; margin-top: 5px;">\`;
                        } else {
                            preview = \`<a href="/storage/uploads/\${file}" target="_blank">\${file}</a>\`;
                        }

                        const listItem = document.createElement("li");
                        listItem.style.marginBottom = "15px";
                        listItem.innerHTML = \`
                            <strong>\${file}</strong><br>
                            \${preview}
                            <br>
                            <button onclick="deleteFile('\${file}')" style="margin-top:5px;">Supprimer</button>
                        \`;
                        fileList.appendChild(listItem);
                    });
                } catch (error) {
                    console.error("Erreur lors du chargement des fichiers :", error);
                }
            }

            async function deleteFile(filename) {
                try {
                    const response = await fetch("/storage/delete/" + filename, { method: "DELETE" });
                    const data = await response.json();

                    fetchFiles(); // 🔄 Rafraîchir la liste après suppression
                } catch (error) {
                    console.error("Erreur lors de la suppression :", error);
                }
            }

            fetchFiles(); // 🔄 Charger la liste des fichiers au démarrage
        </script>
    `);
});

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/files', getFiles);

export default router;
