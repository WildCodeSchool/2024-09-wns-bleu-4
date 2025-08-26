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
import { Contact } from '@/generated/graphql-types';
import { formatFileSize } from '@/lib/utils';
import {
    Download,
    FileText,
    Flag,
    Info,
    MoreVertical,
    Share2,
    Trash2,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FileDeleteDialog from './FileDeleteDialog';
import FileInfoDialog from './FileInfoDialog';
import FileReportDialog from './FileReportDialog';
import FileShareDialog from './FileShareDialog';

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description?: string;
    size: number;
    isShared?: boolean;
    owner?: {
        id: number;
        email: string;
        createdAt?: string;
        profilePicture?: string;
    };
    onFileDeleted?: () => void;
    myContacts?: Contact[];
}

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    size,
    isShared = false,
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
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm truncate mb-1">
                                    {name}
                                </h3>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p className="font-medium">
                                        {formatFileSize(size)}
                                    </p>
                                    {description && (
                                        <p className="truncate line-clamp-2">
                                            {description}
                                        </p>
                                    )}
                                    {isShared && owner && (
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

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="flex-shrink-0"
                            >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">
                                    {t('fileCard.download')}
                                </span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-shrink-0"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">
                                            {t('fileCard.moreOptions')}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <FileInfoDialog
                                        trigger={
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Info className="h-4 w-4 mr-2" />
                                                {t('fileCard.menu.info')}
                                            </DropdownMenuItem>
                                        }
                                        fileName={name}
                                        fileSize={formatFileSize(size)}
                                        description={description}
                                        owner={owner}
                                        isShared={isShared}
                                    />

                                    {!isShared && myContacts.length > 0 && (
                                        <FileShareDialog
                                            trigger={
                                                <DropdownMenuItem
                                                    onSelect={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
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
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
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
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {t(
                                                            'fileCard.menu.delete',
                                                        )}
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
        </>
    );
};

export default FileCard;
