import FilePreview from '@/components/FilePreview';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FileInfoDialogProps {
    trigger: React.ReactNode;
    fileName: string;
    fileUrl?: string;
    fileSize?: string;
    description?: string;
    owner?: {
        id: number;
        email: string;
    };
    isShared?: boolean;
}

const FileInfoDialog: React.FC<FileInfoDialogProps> = ({
    trigger,
    fileName,
    fileUrl,
    fileSize,
    description,
    owner,
    isShared = false,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('fileCard.info.title')}</DialogTitle>
                    <DialogDescription>
                        {t('fileCard.info.description_dialog')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {fileUrl && (
                        <FilePreview
                            fileName={fileName}
                            fileUrl={fileUrl}
                            className="h-fit"
                        />
                    )}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            {t('fileCard.info.name')}
                        </Label>
                        <p className="text-sm text-muted-foreground break-words">
                            {fileName}
                        </p>
                    </div>
                    {fileSize && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                {t('fileCard.info.size')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {fileSize}
                            </p>
                        </div>
                    )}
                    {description && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                {t('fileCard.info.description')}
                            </Label>
                            <p className="text-sm text-muted-foreground break-words">
                                {description}
                            </p>
                        </div>
                    )}
                    {isShared && owner && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                {t('fileCard.info.owner')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {owner.email}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileInfoDialog;
