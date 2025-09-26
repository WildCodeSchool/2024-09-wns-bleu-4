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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthContext } from '@/context/useAuthContext';
import { CREATE_REPORT } from '@/graphql/Report/mutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileGroupReportDialogProps {
    fileIds: number[];
    fileCount: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const FileGroupReportDialog: React.FC<FileGroupReportDialogProps> = ({
    fileIds,
    fileCount,
    isOpen,
    onOpenChange,
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
                let successCount = 0;
                let errorCount = 0;

                // Report each file
                for (const fileId of fileIds) {
                    try {
                        await createReport({
                            variables: {
                                input: {
                                    userId: user.id,
                                    resourceId: fileId,
                                    reason: selectedReason.toUpperCase(),
                                    content: `Signalement: ${t(
                                        `fileCard.report.reasons.${selectedReason}`,
                                    )}`,
                                },
                            },
                        });
                        successCount++;
                    } catch {
                        errorCount = errorCount + 1;
                    }
                }

                // Show appropriate toast messages
                if (successCount === fileIds.length) {
                    toast.success(t('files.groupReportDialog.success', { count: successCount }));
                } else if (successCount > 0) {
                    toast.warn(t('files.groupReportDialog.partialSuccess', { 
                        success: successCount, 
                        total: fileIds.length 
                    }));
                } else {
                    toast.error(t('files.groupReportDialog.error'));
                }

                // Reset form
                setShowConfirmDialog(false);
                setSelectedReason(null);
                onOpenChange(false);
            } catch {
                toast.error(t('files.groupReportDialog.error'));
            }
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('files.groupReportDialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('files.groupReportDialog.description', { count: fileCount })}
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
                            <Button 
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                {t('fileCard.report.confirm.cancel')}
                            </Button>
                            <Button
                                onClick={() => setShowConfirmDialog(true)}
                                disabled={!selectedReason}
                                variant="destructive"
                            >
                                {t('files.groupReportDialog.button', { count: fileCount })}
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
                            {t('files.groupReportDialog.confirm.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('files.groupReportDialog.confirm.description', { 
                                count: fileCount,
                                reason: selectedReason ? t(`fileCard.report.reasons.${selectedReason}`).toLowerCase() : ''
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('fileCard.report.confirm.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmReport}>
                            {t('files.groupReportDialog.confirm.button', { count: fileCount })}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default FileGroupReportDialog;
