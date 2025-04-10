import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { mutate } from 'swr';
import ContactList from '../../components/contactList/ContactList';
import './uploadPage.scss';

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setSuccessMessage(null);

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            await fetch('/storage/upload', {
                method: 'POST',
                body: formData,
            });
        }

        setFiles([]);
        mutate('/storage/files');
        setSuccessMessage('✅ Tous les fichiers ont été envoyés avec succès !');

        setTimeout(() => setSuccessMessage(null), 5000);
        setIsUploading(false);
    };

    return (
        <div className="upload-container">
            <h1>Transférez vos fichiers</h1>
            
            <div className="page-layout">
                <div className="upload-section">
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div 
                            {...getRootProps()} 
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Déposez les fichiers ici...</p>
                            ) : (
                                <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
                            )}
                        </div>

                        {files.length > 0 && (
                            <div className="files-list">
                                <h2>Fichiers sélectionnés :</h2>
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index} className="file-item">
                                            <span className="file-name">{file.name}</span>
                                            <button 
                                                type="button"
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

                        {successMessage && (
                            <div className="success-message">
                                {successMessage}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={files.length === 0 || isUploading}
                        >
                            {isUploading ? 'Envoi en cours...' : 'Envoyer les fichiers'}
                        </button>
                    </form>
                </div>
                
                <div className="contacts-section">
                    <ContactList />
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
