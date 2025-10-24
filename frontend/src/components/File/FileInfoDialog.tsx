import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import UserHoverCard from '@/components/UserHoverCard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FileInfoDialogProps {
    trigger: React.ReactNode;
    fileName: string;
    fileSize?: string;
    description?: string;
    md5Hash?: string;
    owner?: {
        id: number;
        email: string;
    };
    isShared?: boolean;
}

const FileInfoDialog: React.FC<FileInfoDialogProps> = ({
    trigger,
    fileName,
    fileSize,
    description,
    md5Hash,
    owner,
    isShared = false,
}) => {
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyMD5 = async () => {
        if (!md5Hash) return;

        try {
            await navigator.clipboard.writeText(md5Hash);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy MD5 hash:', error);
        }
    };

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
                    {md5Hash && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                MD5 Hash
                            </Label>
                            <button
                                onClick={handleCopyMD5}
                                className="text-sm text-muted-foreground break-words font-mono text-left hover:text-foreground hover:bg-muted/50 p-2 rounded transition-colors cursor-pointer w-full"
                                title="Click to copy MD5 hash"
                            >
                                {isCopied ? 'Copied!' : md5Hash}
                            </button>
                        </div>
                    )}
                    {isShared && owner && (
                        <div className="flex flex-col">
                            <Label className="text-sm font-medium">
                                {t('fileCard.info.owner')}
                            </Label>
                            <UserHoverCard user={owner}>
                                <span className="text-sm text-blue-500 cursor-pointer hover:underline">
                                    {owner.email}
                                </span>
                            </UserHoverCard>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileInfoDialog;
