import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadPage.css';

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-container">
            <h1>Transférez vos fichiers</h1>
            <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Déposez les fichiers ici...</p>
                ) : (
                    <p>Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner</p>
                )}
            </div>

            {files.length > 0 && (
                <div className="files-list">
                    <h2>Fichiers sélectionnés :</h2>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                <span>{file.name}</span>
                                <button 
                                    onClick={() => removeFile(index)}
                                    className="remove-file"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadPage; 