import FilePreview from '@/components/FilePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserHoverCard from '@/components/UserHoverCard';
import { FileCardProps } from '@/types/types';
import { getFileTypeInfo } from '@/utils/fileUtils';
import {
    Download,
    Flag,
    Info,
    Pencil,
    MoreVertical,
    Share2,
    Trash2,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FileDeleteDialog from './FileDeleteDialog';
import FileInfoDialog from './FileInfoDialog';
import FileEditDialog from './FileEditDialog';
import FilePreviewDialog from './FilePreviewDialog';
import FileReportDialog from './FileReportDialog';
import FileShareDialog from './FileShareDialog';

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    formattedSize,
    md5Hash,
    isShared = false,
    isCompact = false,
    owner,
    onFileDeleted,
    myContacts = [],
}) => {
    const { t } = useTranslation();

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="hover:shadow-md transition-all duration-200 p-2.5 hover:bg-accent">
            <CardContent className="p-0">
                <div className="flex items-center justify-between">
                    {/* Left: preview + meta (this opens the preview dialog) */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FilePreviewDialog
                            trigger={
                                <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                                    {isCompact ? (
                                        <div className="text-2xl">
                                            {getFileTypeInfo(name).emoji}
                                        </div>
                                    ) : (
                                        <FilePreview context="card" fileName={name} fileUrl={url} />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-sm truncate mb-1">
                                            {name}
                                        </h3>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p className="font-medium">
                                                {formattedSize}
                                                {isCompact && isShared && owner && (
                                                    <span className="ml-2">
                                                        • {t('fileCard.sharedBy')}{' '}
                                                        <UserHoverCard user={owner}>
                                                            <span className="text-blue-500 cursor-pointer hover:underline">
                                                                {owner.email}
                                                            </span>
                                                        </UserHoverCard>
                                                    </span>
                                                )}
                                            </p>
                                            {!isCompact && description && (
                                                <p className="truncate line-clamp-2">
                                                    {description}
                                                </p>
                                            )}
                                            
                                            {!isCompact && isShared && owner && (
                                                <p className="truncate">
                                                    {t('fileCard.sharedBy')}{' '}
                                                    <UserHoverCard user={owner}>
                                                        <span className="text-blue-500 cursor-pointer hover:underline">
                                                            {owner.email}
                                                        </span>
                                                    </UserHoverCard>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                            fileName={name}
                            fileUrl={url}
                            fileSize={formattedSize}
                            description={description}
                            owner={owner}
                            isShared={isShared}
                        />
                    </div>

                    {/* Right: actions (do NOT open preview dialog) */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="flex-shrink-0"
                        >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">{t('fileCard.download')}</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">{t('fileCard.moreOptions')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    {t('fileCard.download')}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <FileInfoDialog
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Info className="h-4 w-4 mr-2" />
                                            {t('fileCard.menu.info')}
                                        </DropdownMenuItem>
                                    }
                                    fileName={name}
                                    fileSize={formattedSize}
                                    description={description}
                                    md5Hash={md5Hash}
                                    owner={owner}
                                    isShared={isShared}
                                />

                                {owner && !isShared && (
                                    <FileEditDialog
                                        trigger={
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                {t('fileCard.menu.edit')}
                                            </DropdownMenuItem>
                                        }
                                        resourceId={id}
                                        fileName={name}
                                        initialDescription={description}
                                        onUpdated={() => {
                                            // no-op: parent list can refetch if needed; optimistic UI inside dialog
                                        }}
                                    />
                                )}

                                {!isShared && myContacts.length > 0 && (
                                    <FileShareDialog
                                        trigger={
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Share2 className="h-4 w-4 mr-2" />
                                                {t('fileCard.menu.share')}
                                            </DropdownMenuItem>
                                        }
                                        resourceId={id.toString()}
                                        fileName={name}
                                        myContacts={myContacts}
                                    />
                                )}

                                <FileReportDialog
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Flag className="h-4 w-4 mr-2" />
                                            {t('fileCard.menu.report')}
                                        </DropdownMenuItem>
                                    }
                                    resourceId={id}
                                />

                                {!isShared && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <FileDeleteDialog
                                            trigger={
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onSelect={(e) => e.preventDefault()}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    {t('fileCard.menu.delete')}
                                                </DropdownMenuItem>
                                            }
                                            fileName={name}
                                            resourceId={id}
                                            onFileDeleted={onFileDeleted}
                                        />
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileCard;
