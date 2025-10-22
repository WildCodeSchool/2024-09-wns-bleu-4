import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FileExportDialogProps {
    fileCount: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (filename: string) => void;
}

const FileExportDialog: React.FC<FileExportDialogProps> = ({
    fileCount,
    isOpen,
    onOpenChange,
    onConfirm,
}) => {
    const { t } = useTranslation();
    const [filename, setFilename] = useState('');
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

    // Generate default filename when dialog opens
    useEffect(() => {
        if (isOpen) {
            const defaultName = `files-export-${new Date().toISOString().split('T')[0]}`;
            setFilename(defaultName);
            // Focus input after a short delay to ensure dialog is fully rendered
            setTimeout(() => {
                inputRef?.focus();
                inputRef?.select();
            }, 100);
        }
    }, [isOpen, inputRef]);

    const handleSubmit = () => {
        if (filename.trim()) {
            const finalFilename = filename.trim().endsWith('.zip') 
                ? filename.trim() 
                : `${filename.trim()}.zip`;
            onConfirm(finalFilename);
            onOpenChange(false);
        }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('files.groupExportDialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('files.groupExportDialog.description', { count: fileCount })}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="filename">
                            {t('files.groupExportDialog.filenameLabel')}
                        </Label>
                        <Input
                            ref={setInputRef}
                            id="filename"
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('files.groupExportDialog.placeholder')}
                            className="font-mono"
                        />
                        <p className="text-sm text-muted-foreground">
                            {t('files.groupExportDialog.help')}
                        </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button 
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={!filename.trim()}
                        >
                            {t('files.groupExportDialog.createZip')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileExportDialog;
