import {
    File,
    FileCode,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileVideo,
    FolderArchive,
    LucideIcon,
    Music,
} from 'lucide-react';

export interface FileTypeInfo {
    icon: LucideIcon;
    color: string;
    isImage: boolean;
    isVideo: boolean;
    isPdf: boolean;
    emoji: string;
}

// Fonction interne commune pour déterminer le type de fichier
const getFileTypeData = (extension: string) => {
    // Images
    const imageExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'svg',
        'webp',
        'bmp',
        'ico',
    ];
    if (imageExtensions.includes(extension)) {
        return {
            icon: FileImage,
            color: 'text-foreground',
            isImage: true,
            isVideo: false,
            isPdf: false,
            emoji: '🖼️',
        };
    }

    // Vidéos
    const videoExtensions = [
        'mp4',
        'avi',
        'mov',
        'wmv',
        'flv',
        'webm',
        'mkv',
        'm4v',
    ];
    if (videoExtensions.includes(extension)) {
        return {
            icon: FileVideo,
            color: 'text-foreground',
            isImage: false,
            isVideo: true,
            isPdf: false,
            emoji: '🎥',
        };
    }

    // Audio
    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
    if (audioExtensions.includes(extension)) {
        return {
            icon: Music,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: false,
            emoji: '🎵',
        };
    }

    // Documents PDF
    if (extension === 'pdf') {
        return {
            icon: FileText,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: true,
            emoji: '📄',
        };
    }

    // Tableurs
    const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
    if (spreadsheetExtensions.includes(extension)) {
        return {
            icon: FileSpreadsheet,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: false,
            emoji: '📊',
        };
    }

    // Code
    const codeExtensions = [
        'js',
        'jsx',
        'ts',
        'tsx',
        'html',
        'css',
        'scss',
        'json',
        'xml',
        'sql',
        'py',
        'java',
        'c',
        'cpp',
        'php',
        'rb',
        'go',
        'rs',
    ];
    if (codeExtensions.includes(extension)) {
        return {
            icon: FileCode,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: false,
            emoji: '💻',
        };
    }

    // Archives
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];
    if (archiveExtensions.includes(extension)) {
        return {
            icon: FolderArchive,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: false,
            emoji: '📦',
        };
    }

    // Documents texte et autres
    const documentExtensions = ['doc', 'docx', 'txt', 'rtf', 'odt'];
    if (documentExtensions.includes(extension)) {
        return {
            icon: FileText,
            color: 'text-foreground',
            isImage: false,
            isVideo: false,
            isPdf: false,
            emoji: '📝',
        };
    }

    // Défaut
    return {
        icon: File,
        color: 'text-foreground',
        isImage: false,
        isVideo: false,
        isPdf: false,
        emoji: '📄',
    };
};

export const getFileTypeInfo = (fileName: string): FileTypeInfo => {
    const extension = fileName.toLowerCase().split('.').pop() || '';
    return getFileTypeData(extension);
};

// Fonction utilitaire pour formater la taille des fichiers
export const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// Types de fichiers acceptés par défaut
export const defaultAcceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
    ],
    'audio/*': ['.mp3', '.wav'],
    'video/*': ['.mp4', '.mov'],
};

export const createDragAndDropHandlers = (
    setIsDragging: (isDragging: boolean) => void,
    handleFiles: (files: FileList) => void,
) => {
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer?.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    return {
        onDrop,
        onDragOver,
        onDragLeave,
    };
};
