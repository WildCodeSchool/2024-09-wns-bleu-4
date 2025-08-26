import FileShareDialog from '@/components/File/FileShareDialog';
import FileUploader from '@/components/FileUploader/FileUploader';
import { Button } from '@/components/ui/button';
import { CREATE_RESOURCE } from '@/graphql/Resource/mutations';
import { useAuth } from '@/hooks/useAuth';
import { useMyContacts } from '@/hooks/useMyContacts';
import { useMutation } from '@apollo/client';
import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

const UploadPage = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [lastUploadedResourceId, setLastUploadedResourceId] = useState<
        string | null
    >(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const { user } = useAuth();

    const { acceptedContacts } = useMyContacts();
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

        if (!file || !user?.id) return;

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
                        userId: user.id,
                        size: fileSize || file.size,
                    },
                },
            });

            if (resourceResponse.data?.createResource) {
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
                    throw new Error(t('upload.errors.fileUpload'));
                }

                setLastUploadedResourceId(
                    resourceResponse.data.createResource.id,
                );
                setUploadedFileName(file.name);
                setFile(null);
                setDescription('');
                mutate('/storage/files');
                setSuccessMessage(t('upload.success.message'));
            }
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            setErrorMessage(t('upload.errors.upload'));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mx-auto grid grid-cols-1 gap-8 items-start max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold my-8">{t('upload.title')}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FileUploader
                        onFileChange={setFile}
                        onFileSizeChange={setFileSize}
                        onDescriptionChange={setDescription}
                        description={description}
                        isUploading={isUploading}
                        successMessage={successMessage}
                        errorMessage={errorMessage}
                        acceptedFileTypes={acceptedFileTypes}
                    />
                    {successMessage && lastUploadedResourceId && (
                        <div className="flex items-center gap-4">
                            <span>{successMessage}</span>
                            <FileShareDialog
                                trigger={
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        {t('upload.success.shareNow')}
                                    </Button>
                                }
                                resourceId={lastUploadedResourceId}
                                fileName={uploadedFileName}
                                myContacts={acceptedContacts}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UploadPage;
