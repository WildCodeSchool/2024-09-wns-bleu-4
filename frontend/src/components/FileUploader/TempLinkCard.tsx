import FilePreview from '@/components/FilePreview';
import FadeClock from '@/components/Icons/FadeClock';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize } from '@/utils/fileUtils';
import { copyToClipboard } from '@/utils/globalUtils';
import { Copy, DownloadIcon, EyeIcon, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TempLink {
    id: string;
    url: string;
    expiresAt: Date;
    fileName: string;
    fileSize: number;
    isExpired?: boolean;
}

interface TempLinkCardProps {
    link: TempLink;
    onRemoveTempLink: (id: string) => void;
}

const TempLinkCard: React.FC<TempLinkCardProps> = ({
    link,
    onRemoveTempLink,
}) => {
    const { t } = useTranslation();

    const getFileDisplayType = (fileName: string): 'browser' | 'download' => {
        const extension = fileName.toLowerCase().split('.').pop();
        const browserDisplayableExtensions = [
            'html',
            'htm',
            'css',
            'js',
            'json',
            'xml',
            'txt',
            'md',
            'pdf',
            'png',
            'jpg',
            'jpeg',
            'gif',
            'bmp',
            'svg',
            'webp',
            'ico',
            'mp3',
            'wav',
            'ogg',
            'mp4',
            'avi',
            'mov',
            'wmv',
            'flv',
            'webm',
        ];
        return browserDisplayableExtensions.includes(extension || '')
            ? 'browser'
            : 'download';
    };

    const formatTimeRemaining = (expiresAt: Date): string => {
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) return 'Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0)
            return `${hours}h ${minutes}m ${t(
                'upload.page.tempLink.remaining',
            )}`;
        return `${minutes}m ${t('upload.page.tempLink.remaining')}`;
    };

    const handleDownload = () => {
        const linkElement = document.createElement('a');
        linkElement.href = `${link.url}?download=true`;
        linkElement.download = link.fileName;
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    };

    return (
        <Card
            className={`hover:shadow-md transition-all duration-200 ${
                link.isExpired
                    ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-60'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700'
            }`}
        >
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <FilePreview
                                fileName={link.fileName}
                                fileUrl={link.url}
                                className="h-6 w-6 flex-shrink-0"
                            />
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                {link.fileName}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <span>{formatFileSize(link.fileSize)}</span>
                            <span
                                className={`flex items-center gap-1 ${
                                    link.isExpired
                                        ? 'text-red-500 dark:text-red-400'
                                        : ''
                                }`}
                            >
                                <FadeClock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                {link.isExpired
                                    ? t('upload.page.tempLink.expired')
                                    : formatTimeRemaining(link.expiresAt)}
                            </span>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    getFileDisplayType(link.fileName) ===
                                    'browser'
                                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                                }`}
                            >
                                {getFileDisplayType(link.fileName) === 'browser'
                                    ? t('upload.page.tempLink.type.browser')
                                    : t('upload.page.tempLink.type.download')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(link.url)}
                            disabled={link.isExpired}
                            className="flex-shrink-0 cursor-pointer"
                            title={
                                link.isExpired
                                    ? t('upload.page.tempLink.linkExpired')
                                    : t('upload.page.tempLink.actions.copy')
                            }
                        >
                            <Copy className="w-4 h-4" />
                        </Button>

                        {getFileDisplayType(link.fileName) === 'browser' && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                disabled={link.isExpired}
                                className="flex-shrink-0"
                                title={
                                    link.isExpired
                                        ? t('upload.page.tempLink.linkExpired')
                                        : t('upload.page.tempLink.actions.view')
                                }
                            >
                                <a
                                    href={link.isExpired ? '#' : link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                </a>
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            disabled={link.isExpired}
                            className="flex-shrink-0 cursor-pointer"
                            title={
                                link.isExpired
                                    ? t('upload.page.tempLink.linkExpired')
                                    : t('upload.page.tempLink.actions.download')
                            }
                        >
                            <DownloadIcon className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveTempLink(link.id)}
                            className="flex-shrink-0 cursor-pointer"
                            title={t('upload.page.tempLink.actions.delete')}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TempLinkCard;
