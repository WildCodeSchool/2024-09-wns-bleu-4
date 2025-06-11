import FileUploader from '@/components/FileUploader/FileUploader';
import SendToContact from '@/components/SendToContact/SendToContact';
import { CREATE_RESOURCE } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { mutate } from 'swr';
import { useAuth } from '@/hooks/useAuth';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user } = useAuth();

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
                        userId: user?.id,
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

    const handleSendToContact = (contact: { id: string; name: string; email: string }) => {
        // Here you would implement the logic to send the file to the selected contact
        console.log('Sending to contact:', contact);
    };

    return (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-start">
            <div>
                <h1 className="text-2xl font-bold my-8">
                    Transférez votre fichier
                </h1>
    
                <form onSubmit={handleSubmit} className="space-y-6">
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
    
            {file && (
                <div>
                    <h2 className="text-2xl font-bold my-8">Envoyer à un contact</h2>
                    <SendToContact onSend={handleSendToContact} />
                </div>
            )}
        </div>
    );
    
};

export default UploadPage;
