import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface UploadTask {
    id: string;
    fileName: string;
    progress: number;
    status: 'uploading' | 'completed' | 'failed';
    error?: string;
}

interface FileUploadContextType {
    uploads: UploadTask[];
    addUpload: (task: UploadTask) => void;
    updateUpload: (id: string, updates: Partial<UploadTask>) => void;
    removeUpload: (id: string) => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(
    undefined,
);

export const FileUploadProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [uploads, setUploads] = useState<UploadTask[]>([]);

    const addUpload = (task: UploadTask) => {
        setUploads((prev) => [...prev, task]);
    };

    const updateUpload = (id: string, updates: Partial<UploadTask>) => {
        setUploads((prev) =>
            prev.map((upload) =>
                upload.id === id ? { ...upload, ...updates } : upload,
            ),
        );
    };

    const removeUpload = (id: string) => {
        setUploads((prev) => prev.filter((upload) => upload.id !== id));
    };

    return (
        <FileUploadContext.Provider
            value={{ uploads, addUpload, updateUpload, removeUpload }}
        >
            {children}
        </FileUploadContext.Provider>
    );
};

export const useFileUploadContext = () => {
    const context = useContext(FileUploadContext);
    if (!context) {
        throw new Error(
            'useFileUploadContext must be used within a FileUploadProvider',
        );
    }
    return context;
};
