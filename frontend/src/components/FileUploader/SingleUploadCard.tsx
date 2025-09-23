import FilePreview from '@/components/FilePreview';
import { CheckCircle, Loader, Trash2 } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileWithPreview } from '@/types/types';
import { useState } from 'react';

interface SingleUploadCardProps {
    file: FileWithPreview;
    removeFile: (file: FileWithPreview) => void;
}

const SingleUploadCard = ({ file }: SingleUploadCardProps) => {
    const { t } = useTranslation();

    const [description, setDescription] = useState<string>('');

    return (
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
                key={file.id}
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
                    {file.type.startsWith('image/') ? (
                        <img
                            src={file.preview}
                            alt={file.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border dark:border-zinc-700 shadow-sm"
                        />
                    ) : file.type.startsWith('video/') ? (
                        <video
                            src={file.preview}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border dark:border-zinc-700 shadow-sm"
                            controls={false}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    ) : (
                        <FilePreview
                            context="card"
                            fileName={file.name}
                            className="w-5 h-5 flex-shrink-0"
                        />
                    )}
                    {file.progress === 100 && (
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
                                context="card"
                                fileName={file.name}
                                className="w-5 h-5 flex-shrink-0"
                            />
                            <h4
                                className="font-medium text-base md:text-lg truncate text-zinc-800 dark:text-zinc-200"
                                title={file.name}
                            >
                                {file.name}
                            </h4>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="text-xs md:text-sm">
                                {formatFileSize(file.size)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="font-medium">
                                    {Math.round(file.progress)}%
                                </span>
                                {file.progress < 100 ? (
                                    <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                ) : (
                                    <Trash2
                                        className="w-4 h-4 cursor-pointer text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors duration-200"
                                        onClick={() => removeFile(file)}
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
                                width: `${file.progress}%`,
                            }}
                            transition={{
                                duration: 0.4,
                                type: 'spring',
                                stiffness: 100,
                                ease: 'easeOut',
                            }}
                            className={clsx(
                                'h-full rounded-full shadow-inner',
                                file.progress < 100
                                    ? 'bg-blue-500'
                                    : 'bg-emerald-500',
                            )}
                        />
                    </div>

                    <div className="mt-4">
                        <textarea
                            placeholder={t('upload.description.placeholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            rows={4}
                            minLength={4}
                            required
                        />
                        <div className="flex justify-end mt-1 text-xs text-zinc-500">
                            {t('upload.description.charCount', {
                                count: description.length,
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default SingleUploadCard;
