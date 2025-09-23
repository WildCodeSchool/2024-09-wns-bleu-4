import FileShareDialog from '@/components/File/FileShareDialog';
import FilePreview from '@/components/FilePreview';
import { Button } from '@/components/ui/button';
import { CREATE_RESOURCE, DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { useAuth } from '@/hooks/useAuth';
import { useMyContacts } from '@/hooks/useMyContacts';
import {
    createDragAndDropHandlers,
    defaultAcceptedFileTypes,
    formatFileSize,
} from '@/utils/fileUtils';
import { cn } from '@/utils/globalUtils';
import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Loader, Share2, Trash2, UploadCloud } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface FileWithPreview {
    id: string;
    preview: string;
    progress: number;
    name: string;
    size: number;
    type: string;
    lastModified?: number;
    file?: File;
}

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
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [lastUploadedResourceId, setLastUploadedResourceId] = useState<
        string | null
    >(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (fileList: FileList) => {
        if (fileList.length === 0) return;

        const file = fileList[0];

        // Check file size limit (client-side validation for non-subscribed users)
        const isSubscribed = user?.isSubscribed;
        if (!isSubscribed) {
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                toast.error(
                    t('upload.toast.fileTooLarge') ||
                        'File size exceeds 10MB limit for non-subscribed users',
                );
                return;
            }
        }

        const newFile = {
            id: `${URL.createObjectURL(file)}-${Date.now()}`,
            preview: URL.createObjectURL(file),
            progress: 0,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            file,
        };

        setFiles([newFile]); // Replace any existing file
        simulateUpload(newFile.id);
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

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFiles([]);
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files[0]?.file || !user?.id) return;

        setIsUploading(true);

        try {
            const file = files[0].file;
            const secureName = file.name.replace(/\s+/g, '_');
            const fileUrl = `/storage/uploads/${secureName}`;

            const resourceResponse = await createResource({
                variables: {
                    data: {
                        name: file.name,
                        url: fileUrl,
                        description:
                            description || `Fichier uploadé : ${file.name}`,
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

                        // Utiliser le message d'erreur détaillé de la storage API
                        if (errorData.message) {
                            throw new Error(errorData.message);
                        }

                        // Fallback pour les erreurs connues
                        if (storageResponse.status === 429) {
                            throw new Error(
                                "Trop d'uploads. Veuillez patienter avant de réessayer.",
                            );
                        } else {
                            throw new Error(t('upload.errors.fileUpload'));
                        }
                    }

                    setLastUploadedResourceId(resourceId);
                    setUploadedFileName(file.name);
                    setFiles([]);
                    setDescription('');
                    mutate('/storage/files');
                    toast.success(t('upload.success.message'));
                } catch (uploadError) {
                    // Rollback: supprimer la ressource créée si l'upload échoue
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
                    throw uploadError; // Re-throw pour afficher l'erreur à l'utilisateur
                }
            }
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
                            />
                        </div>
                    </motion.div>
                )}

                <div className="mt-8">
                    <AnimatePresence>
                        {files.length > 0 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-between items-center mb-3 px-2"
                                >
                                    <h3 className="font-semibold text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                                        {t('upload.selectedFile.title')}
                                    </h3>
                                </motion.div>

                                <motion.div
                                    key={files[0].id}
                                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 24,
                                    }}
                                    className="px-4 py-4 flex items-start gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 shadow hover:shadow-md transition-all duration-200"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative flex-shrink-0">
                                        {files[0].type.startsWith('image/') ? (
                                            <img
                                                src={files[0].preview}
                                                alt={files[0].name}
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border dark:border-zinc-700 shadow-sm"
                                            />
                                        ) : files[0].type.startsWith(
                                              'video/',
                                          ) ? (
                                            <video
                                                src={files[0].preview}
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border dark:border-zinc-700 shadow-sm"
                                                controls={false}
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <FilePreview
                                                context='card'
                                                fileName={files[0].name}
                                                className="w-5 h-5 flex-shrink-0"
                                            />
                                        )}
                                        {files[0].progress === 100 && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                className="absolute -right-2 -bottom-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm"
                                            >
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FilePreview
                                                    context='card'
                                                    fileName={files[0].name}
                                                    className="w-5 h-5 flex-shrink-0"
                                                />
                                                <h4
                                                    className="font-medium text-base md:text-lg truncate text-zinc-800 dark:text-zinc-200"
                                                    title={files[0].name}
                                                >
                                                    {files[0].name}
                                                </h4>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                <span className="text-xs md:text-sm">
                                                    {formatFileSize(
                                                        files[0].size,
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="font-medium">
                                                        {Math.round(
                                                            files[0].progress,
                                                        )}
                                                        %
                                                    </span>
                                                    {files[0].progress < 100 ? (
                                                        <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                                    ) : (
                                                        <Trash2
                                                            className="w-4 h-4 cursor-pointer text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors duration-200"
                                                            onClick={removeFile}
                                                            aria-label={t(
                                                                'upload.selectedFile.delete',
                                                            )}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${files[0].progress}%`,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    type: 'spring',
                                                    stiffness: 100,
                                                    ease: 'easeOut',
                                                }}
                                                className={clsx(
                                                    'h-full rounded-full shadow-inner',
                                                    files[0].progress < 100
                                                        ? 'bg-blue-500'
                                                        : 'bg-emerald-500',
                                                )}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <textarea
                                                placeholder={t(
                                                    'upload.description.placeholder',
                                                )}
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                rows={4}
                                                minLength={4}
                                                required
                                            />
                                            <div className="flex justify-end mt-1 text-xs text-zinc-500">
                                                {t(
                                                    'upload.description.charCount',
                                                    {
                                                        count: description.length,
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
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
                            <button
                                type="submit"
                                className={clsx(
                                    'px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm',
                                    description.length >= 4 && !isUploading
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed',
                                )}
                                disabled={description.length < 4 || isUploading}
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
