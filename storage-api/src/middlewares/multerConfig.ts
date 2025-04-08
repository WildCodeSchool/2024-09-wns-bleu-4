import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/', // Dossier ou seront stocké les fichiers
    filename: (_req: any, file: { fieldname: string; originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
    },
});

const upload = multer({ storage });

export default upload;
