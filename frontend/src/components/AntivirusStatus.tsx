import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

export enum ScanStatus {
    PENDING = 'pending',
    SCANNING = 'scanning',
    CLEAN = 'clean',
    INFECTED = 'infected',
    ERROR = 'error',
}

interface AntivirusStatusProps {
    status: ScanStatus;
    threatCount?: number;
    scanDate?: Date;
    error?: string;
}

export const AntivirusStatus: React.FC<AntivirusStatusProps> = ({
    status,
    threatCount,
    scanDate,
    error,
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case ScanStatus.PENDING:
                return {
                    icon: Clock,
                    label: 'Pending Scan',
                    variant: 'secondary' as const,
                    color: 'text-gray-500',
                };
            case ScanStatus.SCANNING:
                return {
                    icon: Loader2,
                    label: 'Scanning...',
                    variant: 'secondary' as const,
                    color: 'text-blue-500',
                };
            case ScanStatus.CLEAN:
                return {
                    icon: CheckCircle,
                    label: 'Clean',
                    variant: 'default' as const,
                    color: 'text-green-500',
                };
            case ScanStatus.INFECTED:
                return {
                    icon: XCircle,
                    label: `Infected (${threatCount} threats)`,
                    variant: 'destructive' as const,
                    color: 'text-red-500',
                };
            case ScanStatus.ERROR:
                return {
                    icon: AlertCircle,
                    label: 'Scan Error',
                    variant: 'destructive' as const,
                    color: 'text-red-500',
                };
            default:
                return {
                    icon: Clock,
                    label: 'Unknown',
                    variant: 'secondary' as const,
                    color: 'text-gray-500',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon 
                    className={`h-3 w-3 ${config.color} ${
                        status === ScanStatus.SCANNING ? 'animate-spin' : ''
                    }`} 
                />
                {config.label}
            </Badge>
            
            {scanDate && status !== ScanStatus.PENDING && (
                <span className="text-xs text-gray-500">
                    {new Date(scanDate).toLocaleString()}
                </span>
            )}
            
            {status === ScanStatus.ERROR && error && (
                <span className="text-xs text-red-500" title={error}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default AntivirusStatus;
