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
    filename: (req, file, cb) => {
        console.log(req.query.filename);
        console.log(file);
    
        const apolloFilename = req.query.filename;
    
        if (apolloFilename) {
            cb(null, apolloFilename as string);
        } else {
            cb(
                null,
                file.fieldname +
                    '-' +
                    Date.now() +
                    path.extname(file.originalname),
            );
        }
    }
    
});

// Create separate multer instances for different upload types
const upload = multer({ storage });

// Create a specific instance for temporary files with 10MB limit
const tempUpload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB in bytes
    },
    fileFilter: (req, file, cb) => {
        // Optional: Add file type validation if needed
        cb(null, true);
    }
});

export default upload;
export { tempUpload };
