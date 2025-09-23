import { AnimatePresence, motion } from 'framer-motion';
import { FileWithPreview } from '@/types/types';
import MultiUploadCard from './MultiUploadCard';

interface MultiUploadListProps {
    files: FileWithPreview[];
    descriptions: Record<string, string>;
    onDescriptionChange: (fileId: string, value: string) => void;
    removeFile: (file: FileWithPreview) => void;
}

const MultiUploadList = ({ files, descriptions, onDescriptionChange, removeFile }: MultiUploadListProps) => {
    return (
        <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
                {files.map((file) => (
                    <MultiUploadCard
                        key={file.id}
                        file={file}
                        description={descriptions[file.id] || ''}
                        onDescriptionChange={onDescriptionChange}
                        onRemove={removeFile}
                    />)
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MultiUploadList;


