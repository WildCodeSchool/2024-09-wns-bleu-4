import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GET_RESOURCE_SCAN_RESULT } from '@/graphql/Resource/queries';
import { useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@/components/Loader';

interface FileScanDialogProps {
    trigger: React.ReactNode;
    resourceId: number;
    fileName: string;
}

const POLL_INTERVAL_MS = 12000; // 12s

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    scanning: 'secondary',
    clean: 'default',
    infected: 'destructive',
    error: 'destructive',
};

const FileScanDialog: React.FC<FileScanDialogProps> = ({ trigger, resourceId, fileName }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, loading } = useQuery(
        GET_RESOURCE_SCAN_RESULT,
        {
            variables: { resourceId },
            fetchPolicy: 'cache-first',
            nextFetchPolicy: 'cache-first',
        },
    );

    const scan = data?.getResourceScanResult;

    const statusBadge = useMemo(() => {
        const st = (scan?.status || 'pending') as string;
        const color = statusColor[st] ?? 'outline';
        return <Badge variant={color}>{st.toUpperCase()}</Badge>;
    }, [scan?.status]);

    const infoRow = (label: string, value?: React.ReactNode) => (
        <div className="space-y-1">
            <Label className="text-sm font-medium">{label}</Label>
            <p className="text-sm text-muted-foreground break-words">
                {value
                    ? (typeof value === 'string' && value.length > 50
                        ? value.slice(0, 35) + '...'
                        : value)
                    : '-'}
            </p>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('fileCard.scanDialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('fileCard.scanDialog.description')}
                    </DialogDescription>
                </DialogHeader>
                {loading || scan?.isProcessing ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader size={28} />
                    </div>
                ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate mr-2">{fileName}</div>
                        {statusBadge}
                    </div>

                    <div className="grid gap-4">
                        {infoRow(
                            t('fileCard.scanDialog.analysisId'), 
                            scan?.analysisId ? <a className="text-blue-500" href={`https://www.virustotal.com/gui/file/${scan?.analysisId}`} target="_blank" rel="noopener noreferrer">{scan?.analysisId.slice(0, 35) + '...'}</a> : '-'
                        )}
                        {infoRow(t('fileCard.scanDialog.scanDate'), scan?.scanDate)}
                        {infoRow(t('fileCard.scanDialog.threatCount'), scan?.threatCount?.toString())}
                        {scan?.error && infoRow(t('fileCard.scanDialog.error'), scan?.error)}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" disabled>
                            {t('fileCard.scanDialog.refresh')}
                        </Button>
                        <Button onClick={() => setOpen(false)}>{t('common.close')}</Button>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FileScanDialog;
