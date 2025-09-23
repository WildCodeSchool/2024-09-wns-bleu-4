import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getMimeType = (extension: string): string | undefined => {
    for (const [mime, exts] of Object.entries(ALLOWED_FILE_TYPES)) {
        if (exts.includes(extension)) {
            return mime;
        }
    }
    return undefined;
};

// Liste des types MIME autorisés avec leurs extensions correspondantes
const ALLOWED_FILE_TYPES: Record<string, string[]> = {
    // Images
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/svg+xml': ['.svg'],
    'image/bmp': ['.bmp'],
    'image/tiff': ['.tiff', '.tif'],

    // Documents
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
    ],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
    'application/rtf': ['.rtf'],

    // Code et développement
    'text/javascript': ['.js'],
    'text/typescript': ['.ts'],
    'text/jsx': ['.jsx'],
    'text/tsx': ['.tsx'],
    'text/html': ['.html', '.htm'],
    'text/css': ['.css'],
    'text/json': ['.json'],
    'text/xml': ['.xml'],
    'application/xml': ['.xml'],
    'application/json': ['.json'],

    // Archives
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar'],
    'application/x-7z-compressed': ['.7z'],
    'application/x-tar': ['.tar'],
    'application/gzip': ['.gz'],

    // Audio
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
    'audio/mp4': ['.m4a'],

    // Vidéo
    'video/mp4': ['.mp4'],
    'video/avi': ['.avi'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi'],
    'video/webm': ['.webm'],
    'video/ogg': ['.ogv'],
};

// Fonction de validation des fichiers
const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    // Vérifier le type MIME
    if (!ALLOWED_FILE_TYPES[file.mimetype]) {
        return cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
    }

    // Vérifier l'extension du fichier
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_FILE_TYPES[file.mimetype].includes(fileExtension)) {
        return cb(
            new Error(
                `Extension de fichier non autorisée: ${fileExtension} pour le type ${file.mimetype}`,
            ),
        );
    }

    // Vérifier la taille du fichier
    // Utilisateurs abonnés : pas de limite de taille
    // Utilisateurs non abonnés (authentifiés ou non) : 10MB max
    const isSubscribed = req.user?.isSubscribed;

    if (!isSubscribed) {
        const maxSize = 10 * 1024 * 1024; // 10MB pour les non-abonnés
        if (file.size > maxSize) {
            return cb(
                new Error(
                    `Fichier trop volumineux: ${(
                        file.size /
                        (1024 * 1024)
                    ).toFixed(
                        1,
                    )}MB (max: 10MB pour les utilisateurs non-abonnés)`,
                ),
            );
        }
    }
    // Pour les utilisateurs abonnés : pas de limite de taille

    cb(null, true);
};

// Fonction helper pour générer un nom de fichier unique
const generateUniqueFilename = (
    originalName: string,
    customName?: string,
): string => {
    let baseName = originalName;
    if (customName) {
        baseName = customName;
    }
    const nameWithoutExt = path.parse(baseName).name;
    const ext = path.extname(baseName) || path.extname(originalName);
    // Utiliser UUID pour garantir l'unicité absolue
    return `${nameWithoutExt}-${uuidv4()}${ext}`;
};

const storage = multer.diskStorage({
    destination: (
        _req: any,
        _file: any,
        cb: (arg0: null, arg1: string) => void,
    ) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const customName = req.query.filename as string;
        const uniqueName = generateUniqueFilename(
            file.originalname,
            customName,
        );
        cb(null, uniqueName);
    },
});

// Storage spécifique pour les fichiers temporaires
const tempStorage = multer.diskStorage({
    destination: (
        _req: any,
        _file: any,
        cb: (arg0: null, arg1: string) => void,
    ) => {
        cb(null, 'uploads/temp/');
    },
    filename: (_req, file, cb) => {
        const uniqueName = generateUniqueFilename(file.originalname);
        cb(null, uniqueName);
    },
});

// Create separate multer instances for different upload types
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10, // 10GB max (mais fileFilter gère la logique)
    },
});

// Create a specific instance for temporary files with validation
const tempUpload = multer({
    storage: tempStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max pour les fichiers temporaires
    },
});

export default upload;
export { tempUpload };
