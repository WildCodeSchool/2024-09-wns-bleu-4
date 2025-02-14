import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/', // Dossier où seront stockés les fichiers
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
    },
});

const upload = multer({ storage });

export default upload;
