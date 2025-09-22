import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UPDATE_RESOURCE_DESCRIPTION } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileEditDialogProps {
    trigger: React.ReactNode;
    resourceId: number;
    initialDescription?: string;
    fileName: string;
    onUpdated?: (newDescription: string) => void;
}

const FileEditDialog: React.FC<FileEditDialogProps> = ({
    trigger,
    resourceId,
    initialDescription = '',
    fileName,
    onUpdated,
}) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState(initialDescription ?? '');
    const [updateResourceDescription, { loading }] = useMutation(UPDATE_RESOURCE_DESCRIPTION);

    useEffect(() => {
        if (open) {
            setDescription(initialDescription ?? '');
        }
    }, [open, initialDescription]);

    const handleSubmit = async () => {
        try {
            const { data } = await updateResourceDescription({
                variables: { id: resourceId.toString(), description },
            });
            if (data?.updateResourceDescription?.id) {
                toast.success(t('fileCard.edit.success'));
                onUpdated?.(description);
                setOpen(false);
            } else {
                toast.error(t('fileCard.edit.error'));
            }
        } catch {
            toast.error(t('fileCard.edit.error'));
        }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!loading) handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('fileCard.edit.title')}</DialogTitle>
                    <DialogDescription>
                        {t('fileCard.edit.description', { fileName })}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t('fileCard.info.description')}
                        </Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder={t('fileCard.edit.placeholder')}
                        />
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {t('fileCard.edit.save')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileEditDialog;


