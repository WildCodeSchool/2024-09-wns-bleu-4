import FileUploader from '@/components/FileUploader/FileUploader';
import { CREATE_RESOURCE } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { mutate } from 'swr';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [createResource] = useMutation(CREATE_RESOURCE);

    const acceptedFileTypes = {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
        'audio/*': ['.mp3', '.wav'],
        'video/*': ['.mp4', '.mov'],
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
        <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="">
                <h1 className="text-2xl font-bold my-8">
                    Transférez votre fichier
                </h1>

                <form onSubmit={handleSubmit} className="">
                    <FileUploader
                        onFileChange={setFile}
                        onDescriptionChange={setDescription}
                        description={description}
                        isUploading={isUploading}
                        successMessage={successMessage}
                        errorMessage={errorMessage}
                        acceptedFileTypes={acceptedFileTypes}
                    />
                </form>
            </div>
        </div>
    );
};

export default UploadPage;
