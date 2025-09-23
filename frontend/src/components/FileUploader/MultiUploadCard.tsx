import FilePreview from '@/components/FilePreview';
import { FileWithPreview } from '@/types/types';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatFileSize } from '@/utils/fileUtils';
import { useTranslation } from 'react-i18next';

interface MultiUploadCardProps {
    file: FileWithPreview;
    description: string;
    onDescriptionChange: (fileId: string, value: string) => void;
    onRemove: (file: FileWithPreview) => void;
}

const MultiUploadCard = ({ file, description, onDescriptionChange, onRemove }: MultiUploadCardProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-3 py-3 flex items-start gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700"
        >
            {/* Thumb */}
            <div className="relative flex-shrink-0">
                {file.type.startsWith('image/') ? (
                    <img
                        src={file.preview}
                        alt={file.name}
                        className="w-14 h-14 rounded-md object-cover border dark:border-zinc-700"
                    />
                ) : file.type.startsWith('video/') ? (
                    <video
                        src={file.preview}
                        className="w-14 h-14 rounded-md object-cover border dark:border-zinc-700"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-md border dark:border-zinc-700 flex items-center justify-center bg-white/50 dark:bg-zinc-900/30">
                        <FilePreview context="card" fileName={file.name} className="w-5 h-5" />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                {/* Row 1: name | size + progress | trash */}
                <div className="flex items-center gap-3">
                    {/* Name */}
                    <div className="min-w-0 flex items-center gap-2">
                        <FilePreview context="card" fileName={file.name} className="w-4 h-4 flex-shrink-0" />
                        <h4 className="text-sm font-medium truncate text-zinc-800 dark:text-zinc-200" title={file.name}>
                            {file.name}
                        </h4>
                    </div>

                    {/* Size + Progress in between */}
                    <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                            {formatFileSize(file.size)}
                        </span>
                        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums whitespace-nowrap">
                            {Math.round(file.progress)}%
                        </span>
                    </div>

                    {/* Trash */}
                    <button
                        type="button"
                        className="shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-red-500 transition-colors"
                        onClick={() => onRemove(file)}
                        aria-label={t('upload.selectedFile.delete') as string}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Row 2: description */}
                <div className="mt-2">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => onDescriptionChange(file.id, e.target.value)}
                        placeholder={t('upload.description.placeholder') as string}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        minLength={4}
                        required
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default MultiUploadCard;


