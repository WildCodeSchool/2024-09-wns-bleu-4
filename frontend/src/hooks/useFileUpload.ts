import { CREATE_RESOURCE, DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { useFileUploadContext } from '@/context/FileUploadContext';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

export const useFileUpload = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { addUpload, updateUpload, removeUpload } = useFileUploadContext();
    const [createResource] = useMutation(CREATE_RESOURCE);
    const [deleteResource] = useMutation(DELETE_RESOURCE);

    const uploadFile = async (file: File, description: string) => {
        if (!user?.id) return;

        const uploadId = `${file.name}-${Date.now()}`;
        const secureName = file.name.replace(/\s+/g, '_');

        // Add to global uploads
        addUpload({
            id: uploadId,
            fileName: file.name,
            progress: 0,
            status: 'uploading',
        });

        let resourceId: string | undefined;

        try {
            // Create resource first
            const resourceResponse = await createResource({
                variables: {
                    data: {
                        name: file.name,
                        url: `/storage/uploads/${secureName}`,
                        description:
                            description || `Fichier uploadé : ${file.name}`,
                        userId: user.id,
                        size: file.size,
                    },
                },
            });

            if (!resourceResponse.data?.createResource) {
                throw new Error('Failed to create resource');
            }

            resourceId = resourceResponse.data.createResource.id;

            // Upload file with progress
            await uploadWithProgress(file, secureName, uploadId);

            // Update status
            updateUpload(uploadId, { progress: 100, status: 'completed' });

            // Remove after a delay
            setTimeout(() => removeUpload(uploadId), 3000);

            mutate('/storage/files');
            toast.success(t('upload.success.message'));

            return resourceId;
        } catch (error) {
            console.error('Upload failed:', error);
            updateUpload(uploadId, {
                status: 'failed',
                error: (error as Error).message,
            });

            // Rollback: delete the resource if upload failed
            if (resourceId) {
                try {
                    await deleteResource({
                        variables: { deleteResourceId: resourceId },
                    });
                    console.log(`Rolled back resource ${resourceId}`);
                } catch (rollbackError) {
                    console.error(
                        'Failed to rollback resource:',
                        rollbackError,
                    );
                }
            }

            removeUpload(uploadId)
            toast.error(t('upload.errors.upload'));
            throw error;
        }
    };

    const uploadWithProgress = (
        file: File,
        secureName: string,
        uploadId: string,
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    updateUpload(uploadId, { progress });
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    let errorMessage = t('upload.errors.fileUpload');
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        }
                    } catch {
                        // Ignore parse error
                    }
                    reject(new Error(errorMessage));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error(t('upload.errors.fileUpload')));
            });

            const formData = new FormData();
            formData.append('file', file);

            const storageUrl = `/storage/upload?filename=${encodeURIComponent(
                secureName,
            )}`;
            xhr.open('POST', storageUrl);
            xhr.send(formData);
        });
    };

    return { uploadFile };
};
