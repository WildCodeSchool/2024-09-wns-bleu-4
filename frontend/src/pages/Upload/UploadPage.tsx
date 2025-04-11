import ContactList from '@/components/ContactList/ContactList';
import { CREATE_RESOURCE } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { mutate } from 'swr';
import './uploadPage.scss';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [createResource] = useMutation(CREATE_RESOURCE);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
            'audio/*': ['.mp3', '.wav'],
            'video/*': ['.mp4', '.mov'],
        },
    });

    const removeFile = () => {
        setFile(null);
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;

        setIsUploading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const secureName = file.name.replace(/\s+/g, '_');
            const fileUrl = `/storage/uploads/${secureName}`;

            const resourceResponse = await createResource({
                variables: {
                    data: {
                        name: file.name,
                        path: fileUrl,
                        url: fileUrl,
                        description:
                            description || `Fichier uploadé : ${file.name}`,
                        userId: 1,
                    },
                },
            });

            if (resourceResponse.data) {
                const formData = new FormData();
                formData.append('file', file);

                const storageUrl = `/storage/upload?filename=${encodeURIComponent(
                    secureName,
                )}`;
                const storageResponse = await fetch(storageUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!storageResponse.ok) {
                    throw new Error("Erreur lors de l'upload du fichier");
                }

                setFile(null);
                setDescription('');
                mutate('/storage/files');
                setSuccessMessage(
                    '✅ Le fichier a été envoyé et enregistré avec succès !',
                );
            }
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            setErrorMessage(
                "❌ Une erreur s'est produite. Veuillez réessayer.",
            );
        } finally {
            setIsUploading(false);
            setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
        }
    };

    return (
        <div className="upload-container">
            <h1>Transférez votre fichier</h1>

            <div className="page-layout">
                <div className="upload-section">
                    <form onSubmit={handleSubmit} className="upload-form">
                        {!file && (
                            <div
                                {...getRootProps()}
                                className={`dropzone ${
                                    isDragActive ? 'active' : ''
                                }`}
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Déposez le fichier ici...</p>
                                ) : (
                                    <p>
                                        Glissez-déposez votre fichier ici ou
                                        cliquez pour le sélectionner
                                    </p>
                                )}
                            </div>
                        )}

                        {file && (
                            <div className="files-list">
                                <h2>Fichier sélectionné :</h2>
                                <div className="file-item">
                                    <span className="file-name">
                                        {file.name}
                                    </span>
                                    <div className="file-description">
                                        <textarea
                                            placeholder="Description du fichier (minimum 30 caractères)"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            className="description-input"
                                            rows={4}
                                            minLength={10}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="remove-file"
                                        aria-label="Supprimer le fichier"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {successMessage && (
                            <div className="success-message">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={
                                !file || isUploading || description.length < 30
                            }
                        >
                            {isUploading
                                ? 'Envoi en cours...'
                                : 'Envoyer le fichier'}
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
