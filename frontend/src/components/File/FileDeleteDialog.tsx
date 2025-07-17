import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileDeleteDialogProps {
    trigger: React.ReactNode;
    fileName: string;
    resourceId: number;
    onFileDeleted?: () => void;
}

const FileDeleteDialog: React.FC<FileDeleteDialogProps> = ({
    trigger,
    fileName,
    resourceId,
    onFileDeleted,
}) => {
    const { t } = useTranslation();
    const [deleteResourceMutation] = useMutation(DELETE_RESOURCE);

    const handleDelete = async () => {
        try {
            // 1. Supprimer de la base de données via GraphQL
            const { data } = await deleteResourceMutation({
                variables: { deleteResourceId: resourceId.toString() },
            });

            if (data && data.deleteResource === 'Resource deleted') {
                // 2. Supprimer le fichier du stockage
                try {
                    const response = await fetch(
                        `/storage/delete/${encodeURIComponent(
                            fileName.replace(/ /g, '_'),
                        )}`,
                        {
                            method: 'DELETE',
                        },
                    );

                    if (response.ok) {
                        console.log(t('fileCard.deleteDialog.storageSuccess'));
                    } else {
                        const errorData = await response.json();
                        console.error(
                            t('fileCard.deleteDialog.storageError'),
                            errorData.message,
                        );
                    }
                } catch (storageError) {
                    console.error(
                        t('fileCard.deleteDialog.storageError'),
                        storageError,
                    );
                }

                // 3. Notifier le parent que le fichier a été supprimé (même si le stockage échoue)
                onFileDeleted?.();

                // 4. Afficher le toast de succès
                toast.success(t('fileCard.deleteDialog.success'));
            } else {
                console.error(t('fileCard.deleteDialog.databaseError'));
                toast.error(t('fileCard.deleteDialog.error'));
            }
        } catch (error) {
            console.error(t('fileCard.deleteDialog.error'), error);
            toast.error(t('fileCard.deleteDialog.error'));
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('fileCard.deleteDialog.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('fileCard.deleteDialog.description', {
                            fileName,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {t('fileCard.deleteDialog.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {t('fileCard.deleteDialog.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FileDeleteDialog;
