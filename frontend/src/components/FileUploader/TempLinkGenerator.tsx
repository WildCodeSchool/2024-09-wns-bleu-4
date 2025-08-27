import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    Copy,
    File as FileIcon,
    Link as LinkIcon,
    Loader,
    Trash2,
} from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';


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
}

const TempLinkGenerator = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [tempLinks, setTempLinks] = useState<TempLink[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    };

    const generateTempLink = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

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
                expiresAt: new Date(result.expiresAt),
                fileName: result.originalName,
                fileSize: result.fileSize,
            };

            setTempLinks(prev => [newTempLink, ...prev]);
            setFiles([]);
            toast.success('Temporary link generated successfully!');
        } catch (error) {
            console.error('Error generating temporary link:', error);
            toast.error('Failed to generate temporary link. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            // You could add a toast notification here
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
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
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg"
                    >
                        {successMessage}
                    </motion.div>
                )}

                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </AnimatePresence>

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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-clock-fading-icon lucide-clock-fading w-16 h-16 md:w-20 md:h-20 drop-shadow-sm text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500 transition-colors duration-300"
                            >
                                <path d="M12 2a10 10 0 0 1 7.38 16.75" />
                                <path d="M12 6v6l4 2" />
                                <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
                                <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
                                <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
                                <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
                            </svg>
                        </motion.div>

                        <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                                {isDragging
                                    ? 'Drop here to upload'
                                    : 'Upload a file'}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 md:text-lg max-w-md mx-auto">
                                {isDragging ? (
                                    <span className="font-medium text-blue-500">
                                        Release to upload
                                    </span>
                                ) : (
                                    <>
                                        Drag and drop a file here or{' '}
                                        <span className="text-blue-500 font-medium">
                                            browse
                                        </span>
                                    </>
                                )}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                File will be available for 24 hours
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
                                            Generating Link...
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="w-4 h-4" />
                                            Generate Temporary Link
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
                        Generated Links
                    </h3>
                    <div className="space-y-3">
                        {tempLinks.map((link) => (
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-700"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileIcon className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                                {link.fileName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            <span>
                                                {formatFileSize(link.fileSize)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LinkIcon className="w-3 h-3" />
                                                {formatTimeRemaining(
                                                    link.expiresAt,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                copyToClipboard(link.url)
                                            }
                                            className="p-2 text-zinc-500 hover:text-blue-500 transition-colors duration-200"
                                            title="Copy link"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-zinc-500 hover:text-blue-500 transition-colors duration-200"
                                            title="Open link"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                        </a>
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
