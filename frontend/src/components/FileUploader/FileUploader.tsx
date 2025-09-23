import FileShareDialog from '@/components/File/FileShareDialog';
import { Button } from '@/components/ui/button';
import { CREATE_RESOURCE, DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { useAuth } from '@/hooks/useAuth';
import { useMyContacts } from '@/hooks/useMyContacts';
import {
    createDragAndDropHandlers,
    defaultAcceptedFileTypes,
} from '@/utils/fileUtils';
import { cn } from '@/utils/globalUtils';
import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Share2, UploadCloud } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import SingleUploadCard from './SingleUploadCard';
import MultiUploadList from './MultiUploadList';
import { FileWithPreview } from '@/types/types';

// using shared FileWithPreview type from '@/types/types'

interface FileUploaderProps {
    acceptedFileTypes?: Record<string, string[]>;
}

export default function FileUploader({ acceptedFileTypes }: FileUploaderProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { acceptedContacts } = useMyContacts();
    const [createResource] = useMutation(CREATE_RESOURCE);
    const [deleteResource] = useMutation(DELETE_RESOURCE);

    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [descriptions, setDescriptions] = useState<Record<string, string>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [lastUploadedResourceId, setLastUploadedResourceId] = useState<
        string | null
    >(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (fileList: FileList) => {
        if (fileList.length === 0) return;

        const isSubscribed = user?.isSubscribed;
        const maxSize = 10 * 1024 * 1024;

        const added: FileWithPreview[] = [];
        Array.from(fileList).forEach((file) => {
            if (!isSubscribed && file.size > maxSize) {
                toast.error(
                    t('upload.toast.fileTooLarge') ||
                        'File size exceeds 10MB limit for non-subscribed users',
                );
                return;
            }

            const id = `${URL.createObjectURL(file)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            added.push({
                id,
                preview: URL.createObjectURL(file),
                progress: 0,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                file,
            });
        });

        if (added.length === 0) return;

        setFiles((prev) => [...prev, ...added]);
        added.forEach((f) => simulateUpload(f.id));
    };

    // Simulate upload progress (visual only)
    const simulateUpload = (id: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? { ...f, progress: Math.min(progress, 100) }
                        : f,
                ),
            );
            if (progress >= 100) {
                clearInterval(interval);
                if (navigator.vibrate) navigator.vibrate(100);
            }
        }, 300);
    };

    const { onDrop, onDragOver, onDragLeave } = createDragAndDropHandlers(
        setIsDragging,
        handleFiles,
    );

    const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
    };

    const removeFile = (fileToRemove: FileWithPreview) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileToRemove.id));
        setDescriptions((prev) => {
            const next = { ...prev };
            delete next[fileToRemove.id];
            return next;
        });
    };

    const onDescriptionChange = (fileId: string, value: string) => {
        setDescriptions((prev) => ({ ...prev, [fileId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (files.length === 0 || !user?.id) return;

        setIsUploading(true);

        try {
            let lastResourceId: string | null = null;
            let lastFileName = '';

            for (const f of files) {
                if (!f.file) continue;
                const file = f.file;
                const secureName = file.name.replace(/\s+/g, '_');
                const fileUrl = `/storage/uploads/${secureName}`;

                const resourceResponse = await createResource({
                    variables: {
                        data: {
                            name: file.name,
                            path: fileUrl,
                            url: fileUrl,
                            description:
                                files.length > 1
                                    ? descriptions[f.id] || `Fichier uploadé : ${file.name}`
                                    : `Fichier uploadé : ${file.name}`,
                            userId: user.id,
                            size: file.size,
                        },
                    },
                });

                if (resourceResponse.data?.createResource) {
                    const resourceId = resourceResponse.data.createResource.id;

                    try {
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
                            const errorData = await storageResponse
                                .json()
                                .catch(() => ({}));

                            if (errorData.message) {
                                throw new Error(errorData.message);
                            }

                            if (storageResponse.status === 429) {
                                throw new Error(
                                    "Trop d'uploads. Veuillez patienter avant de réessayer.",
                                );
                            } else {
                                throw new Error(t('upload.errors.fileUpload'));
                            }
                        }

                        lastResourceId = resourceId;
                        lastFileName = file.name;
                    } catch (uploadError) {
                        console.error(
                            'Upload failed, rolling back resource creation:',
                            uploadError,
                        );
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
                        throw uploadError;
                    }
                }
            }

            if (lastResourceId) {
                setLastUploadedResourceId(lastResourceId);
                setUploadedFileName(lastFileName);
            }
            setFiles([]);
            setDescriptions({});
            mutate('/storage/files');
            toast.success(t('upload.success.message'));
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            toast.error(t('upload.errors.upload'));
        } finally {
            setIsUploading(false);
        }
    };

    const finalAcceptedTypes = acceptedFileTypes || defaultAcceptedFileTypes;

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="space-y-6">
                {files.length === 0 && (
                    <motion.div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        initial={false}
                        animate={{
                            borderColor: isDragging ? '#3b82f6' : '#ffffff10',
                            scale: isDragging ? 1.02 : 1,
                        }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className={clsx(
                            'relative rounded-2xl p-8 md:p-12 text-center cursor-pointer bg-secondary/50 border border-primary/10 shadow-sm hover:shadow-md backdrop-blur group',
                            isDragging &&
                                'ring-4 ring-blue-400/30 border-blue-500',
                        )}
                    >
                        <div className="flex flex-col items-center gap-5">
                            <motion.div
                                animate={{ y: isDragging ? [-5, 0, -5] : 0 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: isDragging ? Infinity : 0,
                                    ease: 'easeInOut',
                                }}
                                className="relative"
                            >
                                <motion.div
                                    animate={{
                                        opacity: isDragging ? [0.5, 1, 0.5] : 1,
                                        scale: isDragging
                                            ? [0.95, 1.05, 0.95]
                                            : 1,
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: isDragging ? Infinity : 0,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute -inset-4 bg-blue-400/10 rounded-full blur-md"
                                    style={{
                                        display: isDragging ? 'block' : 'none',
                                    }}
                                />
                                <UploadCloud
                                    className={cn(
                                        'w-16 h-16 md:w-20 md:h-20 drop-shadow-sm',
                                        isDragging
                                            ? 'text-blue-500'
                                            : 'text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500 transition-colors duration-300',
                                    )}
                                />
                            </motion.div>

                            <div className="space-y-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                                    {isDragging
                                        ? t('upload.dragDrop.dropHere')
                                        : t(
                                              'upload.page.deposit.dropBox.title',
                                          )}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-300 md:text-lg max-w-md mx-auto">
                                    {isDragging ? (
                                        <span className="font-medium text-blue-500">
                                            {t(
                                                'upload.dragDrop.releaseToUpload',
                                            )}
                                        </span>
                                    ) : (
                                        <span>
                                            {t(
                                                'upload.page.deposit.dropBox.supportedTypes',
                                            )}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {t('upload.page.deposit.dropBox.notice')}
                                </p>
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                hidden
                                onChange={onSelect}
                                accept={Object.entries(finalAcceptedTypes)
                                    .map(([, extensions]) =>
                                        extensions.join(','),
                                    )
                                    .join(',')}
                                multiple
                            />
                        </div>
                    </motion.div>
                )}

                <div className="mt-8">
                    <AnimatePresence>
                        {files.length === 1 && (
                            <SingleUploadCard
                                key={files[0].id}
                                file={files[0]}
                                onRemove={removeFile}
                            />
                        )}
                        {files.length > 1 && (
                            <MultiUploadList
                                key={files[0].id}
                                files={files}
                                descriptions={descriptions}
                                onDescriptionChange={onDescriptionChange}
                                removeFile={removeFile}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit button */}
                <AnimatePresence>
                    {files.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 flex"
                        >
                            {(() => {
                                const allDescriptionsValid =
                                    files.length > 1
                                        ? files.every((f) => (descriptions[f.id] || '').trim().length > 4)
                                        : true;
                                const allUploaded = files.every((f) => f.progress >= 100);
                                const canSubmit = allDescriptionsValid && allUploaded && !isUploading;
                                return (
                                    <button
                                        type="submit"
                                        className={clsx(
                                            'px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm',
                                            canSubmit
                                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed',
                                        )}
                                        disabled={!canSubmit}
                                    >
                                        {isUploading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader className="w-4 h-4 animate-spin" />
                                                {t('upload.submit.uploading')}
                                            </span>
                                        ) : (
                                            t('upload.submit.save')
                                        )}
                                    </button>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success message with share dialog */}
                {lastUploadedResourceId && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <span>{t('upload.success.message')}</span>
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
                    </motion.div>
                )}
            </form>
        </div>
    );
}
