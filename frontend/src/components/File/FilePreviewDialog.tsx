import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FilePreview from '@/components/FilePreview';
import { FileCardProps } from '@/types/types';
import { Download } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FilePreviewDialogProps {
    trigger: React.ReactNode;
    fileName: string;
    fileUrl: string;
    fileSize: string;
    description?: string;
    owner?: FileCardProps['owner'];
    isShared?: boolean;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
    trigger,
    fileName,
    fileUrl,
    fileSize,
    description,
    owner,
    isShared = false,
}) => {
    const { t } = useTranslation();

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg font-semibold truncate">
                                {fileName}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">
                                {fileSize}
                                {isShared && owner && (
                                    <span className="ml-2">
                                        • {t('fileCard.sharedBy')} {owner.email}
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="flex-shrink-0 mr-8"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {t('fileCard.download')}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden">
                    <div className="h-[60vh] flex items-center justify-center bg-muted/20">
                        <FilePreview className="w-full" context="dialog" fileName={fileName} fileUrl={fileUrl} />
                    </div>
                </div>

                {description && (
                    <div className="px-6 py-4 border-t bg-muted/10">
                        <h4 className="text-sm font-medium mb-2">
                            {t('fileCard.info.description')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FilePreviewDialog;
