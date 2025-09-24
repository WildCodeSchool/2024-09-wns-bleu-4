import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import VirusTotal from '@/components/Icons/VirusTotal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GET_RESOURCE_SCAN_RESULT } from '@/graphql/Resource/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@/components/Loader';

interface FileScanDialogProps {
    trigger: React.ReactNode;
    resourceId: number;
    fileName: string;
}

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

    const { data, loading, refetch } = useQuery(
        GET_RESOURCE_SCAN_RESULT,
        {
            variables: { resourceId },
            fetchPolicy: 'cache-first',
            nextFetchPolicy: 'cache-first',
        },
    );

    const [hasOpened, setHasOpened] = useState(false);
    const [lastStatus, setLastStatus] = useState<string | undefined>(undefined);

    // Track latest status
    useEffect(() => {
        const st = data?.getResourceScanResult?.status as string | undefined;
        if (st) setLastStatus(st);
    }, [data?.getResourceScanResult?.status]);

    // On first open, force a refetch to get freshest VT status. Afterwards, only refetch if still scanning.
    useEffect(() => {
        if (!open) return;
        if (!hasOpened) {
            setHasOpened(true);
            refetch();
        } else if (lastStatus === 'scanning') {
            refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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
                    : t('fileCard.scanDialog.loading')}
            </p>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md" hideCloseButton={true}>
                <DialogHeader>
                    <div className="flex items-center justify-between gap-3">
                        <DialogTitle>{t('fileCard.scanDialog.title')}</DialogTitle>
                        <a
                            href="https://www.virustotal.com/gui/home/upload"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline"
                        >
                            <Badge className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 gap-2 cursor-pointer">
                                <VirusTotal />
                                Powered by VirusTotal
                            </Badge>
                        </a>
                    </div>
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
                            scan?.analysisId ? <a className="text-blue-500" href={`https://www.virustotal.com/gui/file/${scan?.analysisId}`} target="_blank" rel="noopener noreferrer">{scan?.analysisId.slice(0, 35) + '...'}</a> : t('fileCard.scanDialog.loading')
                        )}
                        {infoRow(t('fileCard.scanDialog.scanDate'), scan?.scanDate)}
                        {infoRow(t('fileCard.scanDialog.threatCount'), scan?.threatCount?.toString())}
                        {scan?.error && infoRow(t('fileCard.scanDialog.error'), scan?.error)}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button className="cursor-pointer" onClick={() => setOpen(false)}>{t('common.close')}</Button>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FileScanDialog;
