import FadeClock from '@/components/Icons/FadeClock';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FileWithPreview, TempLink } from '@/types/types';
import { createDragAndDropHandlers, formatFileSize } from '@/utils/fileUtils';
import { cn } from '@/utils/globalUtils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    File as FileIcon,
    Link as LinkIcon,
    Loader,
    Trash2,
} from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TempLinkCard from './TempLinkCard';

const STORAGE_KEY = 'tempLinks';

interface TempLinkGeneratorProps {
    acceptedFileTypes: Record<string, string[]>;
}

const TempLinkGenerator = ({ acceptedFileTypes }: TempLinkGeneratorProps) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { setItem, getItem } = useLocalStorage();
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [tempLinks, setTempLinks] = useState<TempLink[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load temp links from localStorage on component mount
    useEffect(() => {
        loadTempLinksFromStorage();
    }, []);

    // Save temp links to localStorage whenever they change
    useEffect(() => {
        saveTempLinksToStorage();
    }, [tempLinks]);

    // Add event listener for when the page becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadTempLinksFromStorage();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Also listen for focus events (when user returns to tab)
        const handleFocus = () => {
            loadTempLinksFromStorage();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Periodically check for expired links (every minute)
    useEffect(() => {
        const interval = setInterval(() => {
            setTempLinks((prev) =>
                prev.map((link) => ({
                    ...link,
                    isExpired: new Date() > link.expiresAt,
                })),
            );
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const loadTempLinksFromStorage = useCallback(() => {
        try {
            const stored = getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert string dates back to Date objects and check expiration
                const linksWithExpiration = parsed.map(
                    (
                        link: Omit<TempLink, 'expiresAt'> & {
                            expiresAt: string;
                        },
                    ) => {
                        const expiresAt = new Date(link.expiresAt);
                        const isExpired = new Date() > expiresAt;
                        return {
                            ...link,
                            expiresAt,
                            isExpired,
                        };
                    },
                );

                // Keep all links but mark expired ones
                setTempLinks(linksWithExpiration);

                // Clean up expired links from storage (optional - you can keep them for reference)
                const validLinks = linksWithExpiration.filter(
                    (link: TempLink) => !link.isExpired,
                );
                if (validLinks.length !== linksWithExpiration.length) {
                    setItem(STORAGE_KEY, JSON.stringify(validLinks));
                }
            }
        } catch (error) {
            console.error('Error loading temp links from localStorage:', error);
        }
    }, [getItem, setItem, setTempLinks]);

    const saveTempLinksToStorage = useCallback(() => {
        try {
            setItem(STORAGE_KEY, JSON.stringify(tempLinks));
        } catch (error) {
            console.error('Error saving temp links to localStorage:', error);
        }
    }, [setItem, tempLinks]);

    const handleFiles = (fileList: FileList) => {
        if (fileList.length === 0) return;

        const file = fileList[0];

        // Check file size limit (client-side validation for non-subscribed users)
        const isSubscribed = user?.isSubscribed;
        if (!isSubscribed) {
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                toast.error(
                    t('upload.page.tempLink.toast.fileTooLarge') ||
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

        setFiles([newFile]);
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
    };

    const generateTempLink = async () => {
        if (files.length === 0) return;

        setIsUploading(true);

        try {
            const file = files[0];

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file.file!);

            // Upload file to storage-api
            const response = await fetch('/storage/temp/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Utiliser le message d'erreur détaillé de la storage API
                if (errorData.message) {
                    throw new Error(errorData.message);
                }

                // Fallback pour les erreurs connues
                if (response.status === 413) {
                    throw new Error(
                        t('upload.page.tempLink.toast.fileTooLarge'),
                    );
                } else if (response.status === 429) {
                    throw new Error(
                        'Trop de tentatives. Veuillez patienter avant de réessayer.',
                    );
                } else if (response.status === 400) {
                    throw new Error('Format de fichier non valide');
                } else {
                    throw new Error("Erreur lors de l'upload du fichier");
                }
            }

            const result = await response.json();

            // Create new temp link with real data
            const newTempLink: TempLink = {
                id: result.tempId,
                url: `${window.location.origin}/storage${result.accessUrl}`,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
                fileName: result.originalName,
                fileSize: result.fileSize,
                isExpired: false,
            };

            setTempLinks((prev) => [newTempLink, ...prev]);
            setFiles([]);
            toast.success(t('upload.page.tempLink.toast.success'));
        } catch (error) {
            console.error('Error generating temporary link:', error);
            toast.error(t('upload.page.tempLink.toast.error'));
        } finally {
            setIsUploading(false);
        }
    };

    const removeTempLink = (id: string) => {
        setTempLinks((prev) => prev.filter((link) => link.id !== id));
        toast.info(t('upload.page.tempLink.toast.delete'));
    };

    return (
        <div className="space-y-6">
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
                    className="relative rounded-2xl p-8 md:p-12 text-center cursor-pointer bg-secondary/50 border border-primary/10 shadow-sm hover:shadow-md backdrop-blur group"
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
                                    scale: isDragging ? [0.95, 1.05, 0.95] : 1,
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
                            <FadeClock
                                className={cn(
                                    'lucide lucide-clock-fading-icon lucide-clock-fading w-16 h-16 md:w-20 md:h-20 drop-shadow-sm group-hover:text-blue-500 transition-colors duration-300',
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
                                    : t('upload.page.tempLink.dropBox.title')}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 md:text-lg max-w-md mx-auto">
                                {isDragging ? (
                                    <span className="font-medium text-blue-500">
                                        {t('upload.dragDrop.releaseToUpload')}
                                    </span>
                                ) : (
                                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                                        {t(
                                            'upload.page.tempLink.dropBox.supportedTypes',
                                        )}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {t('upload.dragDrop.maxSize')}
                            </p>
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            hidden
                            onChange={onSelect}
                            accept={Object.entries(acceptedFileTypes)
                                .map(([, extensions]) => extensions.join(','))
                                .join(',')}
                        />
                    </div>
                </motion.div>
            )}

            {/* File preview and generate button */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="px-4 py-4 flex items-start gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 shadow">
                            <div className="relative flex-shrink-0">
                                {files[0].type.startsWith('image/') ? (
                                    <img
                                        src={files[0].preview}
                                        alt={files[0].name}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border dark:border-zinc-700 shadow-sm"
                                    />
                                ) : files[0].type.startsWith('video/') ? (
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
                                    <FileIcon className="w-16 h-16 md:w-20 md:h-20 text-zinc-400" />
                                )}
                                {files[0].progress === 100 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute -right-2 -bottom-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm"
                                    >
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0 mb-2">
                                    <FileIcon className="w-5 h-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                                    <h4 className="font-medium text-base md:text-lg truncate text-zinc-800 dark:text-zinc-200">
                                        {files[0].name}
                                    </h4>
                                </div>

                                <div className="flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                                    <span>{formatFileSize(files[0].size)}</span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="font-medium">
                                            {Math.round(files[0].progress)}%
                                        </span>
                                        {files[0].progress < 100 ? (
                                            <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                        ) : (
                                            <Trash2
                                                className="w-4 h-4 cursor-pointer text-zinc-400 hover:text-red-500 transition-colors duration-200"
                                                onClick={removeFile}
                                            />
                                        )}
                                    </span>
                                </div>

                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${files[0].progress}%`,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: 'easeOut',
                                        }}
                                        className={`h-full rounded-full ${
                                            files[0].progress < 100
                                                ? 'bg-blue-500'
                                                : 'bg-emerald-500'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {files[0].progress === 100 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={generateTempLink}
                                    disabled={isUploading}
                                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            {t(
                                                'upload.page.tempLink.generating',
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="w-4 h-4" />
                                            {t(
                                                'upload.page.tempLink.actions.generate',
                                            )}
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generated temporary links */}
            {tempLinks.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                        {t('upload.page.tempLink.generatedLinks')}
                    </h3>
                    <div className="space-y-3">
                        {tempLinks.map((link) => (
                            <TempLinkCard
                                key={link.id}
                                link={link}
                                onRemoveTempLink={removeTempLink}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempLinkGenerator;
