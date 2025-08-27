import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    Copy,
    DownloadIcon,
    EyeIcon,
    File as FileIcon,
    Link as LinkIcon,
    Loader,
    Trash2,
} from 'lucide-react';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import FadeClock from '@/components/Icons/FadeClock';

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

interface TempLink {
    id: string;
    url: string;
    expiresAt: Date;
    fileName: string;
    fileSize: number;
    isExpired?: boolean;
}

const STORAGE_KEY = 'tempLinks';

const TempLinkGenerator = () => {
    const { t } = useTranslation();
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
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Periodically check for expired links (every minute)
    useEffect(() => {
        const interval = setInterval(() => {
            setTempLinks(prev => 
                prev.map(link => ({
                    ...link,
                    isExpired: new Date() > link.expiresAt
                }))
            );
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const loadTempLinksFromStorage = () => {
        try {
            const stored = getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert string dates back to Date objects and check expiration
                const linksWithExpiration = parsed
                    .map((link: Omit<TempLink, 'expiresAt'> & { expiresAt: string }) => {
                        const expiresAt = new Date(link.expiresAt);
                        const isExpired = new Date() > expiresAt;
                        return {
                            ...link,
                            expiresAt,
                            isExpired
                        };
                    });
                
                // Keep all links but mark expired ones
                setTempLinks(linksWithExpiration);
                
                // Clean up expired links from storage (optional - you can keep them for reference)
                const validLinks = linksWithExpiration.filter((link: TempLink) => !link.isExpired);
                if (validLinks.length !== linksWithExpiration.length) {
                    setItem(STORAGE_KEY, JSON.stringify(validLinks));
                }
            }
        } catch (error) {
            console.error('Error loading temp links from localStorage:', error);
        }
    };

    const saveTempLinksToStorage = () => {
        try {
            setItem(STORAGE_KEY, JSON.stringify(tempLinks));
        } catch (error) {
            console.error('Error saving temp links to localStorage:', error);
        }
    };

    const handleFiles = (fileList: FileList) => {
        if (fileList.length === 0) return;

        const file = fileList[0];
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

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFiles([]);
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatTimeRemaining = (expiresAt: Date): string => {
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) return 'Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `${hours}h ${minutes}m ${t('upload.page.tempLink.remaining')}`;
        return `${minutes}m ${t('upload.page.tempLink.remaining')}`;
    };

    const getFileDisplayType = (fileName: string): 'browser' | 'download' => {
        const extension = fileName.toLowerCase().split('.').pop();
        const browserDisplayableExtensions = [
            'html', 'htm', 'css', 'js', 'json', 'xml', 'txt', 'md', 'pdf',
            'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'ico',
            'mp3', 'wav', 'ogg', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'
        ];
        
        return browserDisplayableExtensions.includes(extension || '') ? 'browser' : 'download';
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.toLowerCase().split('.').pop();
        
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(extension || '')) {
            return '🖼️';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
            return '🎥';
        } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
            return '🎵';
        } else if (['pdf'].includes(extension || '')) {
            return '📄';
        } else if (['doc', 'docx'].includes(extension || '')) {
            return '📝';
        } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
            return '📦';
        } else {
            return '📁';
        }
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
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            
            // Create new temp link with real data
            const newTempLink: TempLink = {
                id: result.tempId,
                url: `${window.location.origin}/storage${result.accessUrl}`,
                expiresAt: new Date(Date.now() + 1 * 60 * 1000), // 1 minute
                fileName: result.originalName,
                fileSize: result.fileSize,
                isExpired: false,
            };

            setTempLinks(prev => [newTempLink, ...prev]);
            setFiles([]);
            toast.success(t('upload.page.tempLink.toast.success'));
        } catch (error) {
            console.error('Error generating temporary link:', error);
            toast.error(t('upload.page.tempLink.toast.error'));
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success(t('upload.page.tempLink.toast.copy'));
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            toast.error(t('upload.page.tempLink.toast.error'));
        }
    };

    const removeTempLink = (id: string) => {
        setTempLinks(prev => prev.filter(link => link.id !== id));
        toast.info(t('upload.page.tempLink.toast.delete'));
    };

    const acceptedFileTypes = {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
        'audio/*': ['.mp3', '.wav'],
        'video/*': ['.mp4', '.mov'],
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
                            <FadeClock className="lucide lucide-clock-fading-icon lucide-clock-fading w-16 h-16 md:w-20 md:h-20 drop-shadow-sm text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500 transition-colors duration-300" />
                        </motion.div>

                        <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                                {isDragging
                                    ? t('upload.dragDrop.dropHere')
                                    : t('upload.title')}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 md:text-lg max-w-md mx-auto">
                                {isDragging ? (
                                    <span className="font-medium text-blue-500">
                                        {t('upload.dragDrop.dropHere')}
                                    </span>
                                ) : (
                                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                                        {t('upload.title')}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {t('upload.dragDrop.supportedTypes')}
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
                                            {t('upload.page.tempLink.generating')}
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="w-4 h-4" />
                                            {t('upload.page.tempLink.actions.generate')}
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
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg border transition-all duration-200 ${
                                    link.isExpired
                                        ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-60'
                                        : 'bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{getFileIcon(link.fileName)}</span>
                                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                                {link.fileName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            <span>
                                                {formatFileSize(link.fileSize)}
                                            </span>
                                            <span className={`flex items-center gap-1 ${
                                                link.isExpired ? 'text-red-500 dark:text-red-400' : ''
                                            }`}>
                                                <FadeClock className="w-3 h-3" />
                                                {link.isExpired ? t('upload.page.tempLink.expired') : formatTimeRemaining(link.expiresAt)}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                getFileDisplayType(link.fileName) === 'browser'
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                                            }`}>
                                                {getFileDisplayType(link.fileName) === 'browser' ? t('upload.page.tempLink.type.browser') : t('upload.page.tempLink.type.download')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                copyToClipboard(link.url)
                                            }
                                            disabled={link.isExpired}
                                            className={`p-2 transition-colors duration-200 ${
                                                link.isExpired
                                                    ? 'text-zinc-400 dark:text-zinc-500'
                                                    : 'text-zinc-500 hover:text-yellow-500 cursor-pointer'
                                            }`}
                                            title={link.isExpired ? t('upload.page.tempLink.linkExpired') : t('upload.page.tempLink.actions.copy')}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        
                                        {/* View/Open button */}
                                        {getFileDisplayType(link.fileName) === 'browser' && (
                                            <a
                                                href={link.isExpired ? '#' : link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2 transition-colors duration-200 ${
                                                    link.isExpired
                                                        ? 'text-zinc-400 dark:text-zinc-500 pointer-events-none'
                                                        : 'text-zinc-500 hover:text-green-500'
                                                }`}
                                                title={link.isExpired ? t('upload.page.tempLink.linkExpired') : t('upload.page.tempLink.actions.open')}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                        
                                        {/* Download button */}
                                        <a
                                            href={link.isExpired ? '#' : `${link.url}?download=true`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-2 transition-colors duration-200 ${
                                                link.isExpired
                                                    ? 'text-zinc-400 dark:text-zinc-500 pointer-events-none'
                                                    : 'text-zinc-500 hover:text-blue-500'
                                            }`}
                                            title={link.isExpired ? t('upload.page.tempLink.linkExpired') : t('upload.page.tempLink.actions.download')}
                                        >
                                            <DownloadIcon className="w-4 h-4" />
                                        </a>
                                        
                                        <button
                                            onClick={() => removeTempLink(link.id)}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                            title={t('upload.page.tempLink.actions.delete')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempLinkGenerator;
