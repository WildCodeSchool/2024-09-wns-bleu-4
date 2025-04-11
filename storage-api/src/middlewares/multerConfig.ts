import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (
        _req: any,
        _file: any,
        cb: (arg0: null, arg1: string) => void,
    ) => {
        cb(null, 'uploads/');
    },
    filename: (
        req: any,
        file: { fieldname: string; originalname: string },
        cb: (arg0: null, arg1: string) => void,
    ) => {
        const apolloFilename = req.query.filename;

        if (apolloFilename) {
            cb(null, apolloFilename);
        } else {
            cb(
                null,
                file.fieldname +
                    '-' +
                    Date.now() +
                    path.extname(file.originalname),
            );
        }
    },
});

const upload = multer({ storage });

export default upload;
