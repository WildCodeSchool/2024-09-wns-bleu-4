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
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthContext } from '@/context/useAuthContext';
import { CREATE_REPORT } from '@/graphql/Report/mutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileReportDialogProps {
    trigger: React.ReactNode;
    resourceId: number;
}

const FileReportDialog: React.FC<FileReportDialogProps> = ({
    trigger,
    resourceId,
}) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [createReport] = useMutation(CREATE_REPORT);

    const reportReasons = [
        'corrupted',
        'display',
        'inappropriate',
        'harassment',
        'spam',
        'other',
    ];

    const handleConfirmReport = async () => {
        if (selectedReason && user) {
            try {
                await createReport({
                    variables: {
                        input: {
                            userId: user.id,
                            resourceId: resourceId,
                            reason: selectedReason.toUpperCase(),
                            content: `Signalement: ${t(
                                `fileCard.report.reasons.${selectedReason}`,
                            )}`,
                        },
                    },
                });
                toast.success(t('fileCard.report.success'));
                setShowConfirmDialog(false);
                setSelectedReason(null);
            } catch {
                toast.error(t('fileCard.report.error'));
            }
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('fileCard.report.title')}</DialogTitle>
                        <DialogDescription>
                            {t('fileCard.report.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label>{t('fileCard.report.reason')}</Label>
                            <RadioGroup
                                className="space-y-2 mt-4"
                                value={selectedReason || ''}
                                onValueChange={setSelectedReason}
                            >
                                {reportReasons.map((reason) => (
                                    <div
                                        key={reason}
                                        className="flex items-center space-x-2"
                                    >
                                        <RadioGroupItem
                                            value={reason}
                                            id={reason}
                                        />
                                        <Label htmlFor={reason}>
                                            {t(
                                                `fileCard.report.reasons.${reason}`,
                                            )}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    {t('fileCard.report.confirm.cancel')}
                                </Button>
                            </DialogTrigger>
                            <Button
                                onClick={() => setShowConfirmDialog(true)}
                                disabled={!selectedReason}
                                variant="destructive"
                            >
                                {t('fileCard.report.confirm.confirm')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('fileCard.report.confirm.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('fileCard.report.confirm.description')}
                            {selectedReason && (
                                <span>
                                    {' '}
                                    {t(
                                        `fileCard.report.reasons.${selectedReason}`,
                                    ).toLowerCase()}
                                </span>
                            )}
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('fileCard.report.confirm.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmReport}>
                            {t('fileCard.report.confirm.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default FileReportDialog;
