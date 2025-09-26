import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileGroupDeleteDialogProps {
    fileIds: number[];
    fileCount: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onFilesDeleted?: () => void;
}

const FileGroupDeleteDialog: React.FC<FileGroupDeleteDialogProps> = ({
    fileIds,
    fileCount,
    isOpen,
    onOpenChange,
    onFilesDeleted,
}) => {
    const { t } = useTranslation();
    const [deleteResourceMutation] = useMutation(DELETE_RESOURCE);

    const handleDelete = async () => {
        try {
            let successCount = 0;

            // Delete each file
            for (const fileId of fileIds) {
                try {
                    const { data } = await deleteResourceMutation({
                        variables: { deleteResourceId: fileId.toString() },
                    });

                    if (data?.deleteResource === 'Resource deleted') {
                        successCount++;
                    }
                } catch {
                    // Error handled by toast messages below
                }
            }

            // Show appropriate toast messages
            if (successCount === fileIds.length) {
                toast.success(t('files.groupDeleteDialog.success', { count: successCount }));
            } else if (successCount > 0) {
                toast.warn(t('files.groupDeleteDialog.partialSuccess', { 
                    success: successCount, 
                    total: fileIds.length 
                }));
            } else {
                toast.error(t('files.groupDeleteDialog.error'));
            }

            onFilesDeleted?.();
        } catch {
            toast.error(t('files.groupDeleteDialog.error'));
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('files.groupDeleteDialog.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('files.groupDeleteDialog.description', {
                            count: fileCount,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {t('files.groupDeleteDialog.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {t('files.groupDeleteDialog.confirm', {
                            count: fileCount,
                        })}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FileGroupDeleteDialog;
