import FileCard from '@/components/File/FileCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Contact, Resource } from '@/generated/graphql-types';
import { ChevronLeft, ChevronRight, LucideIcon, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface PaginationInfo {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface FileSectionProps {
    title: string;
    icon: LucideIcon;
    files: Resource[];
    emptyTitle: string;
    emptyDescription: string;
    isShared?: boolean;
    onFileDeleted?: () => void;
    myContacts?: Contact[];
    showUploadButton?: boolean;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
}

const FileSection: React.FC<FileSectionProps> = ({
    title,
    icon: Icon,
    files,
    emptyTitle,
    emptyDescription,
    isShared = false,
    onFileDeleted,
    myContacts,
    showUploadButton = false,
    pagination,
    onPageChange,
}) => {
    const { t } = useTranslation();
    const [isCompact, setIsCompact] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Badge variant="secondary">
                        {pagination ? pagination.totalCount : files.length}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {t('files.compactMode')}
                    </span>
                    <Switch
                        checked={isCompact}
                        onCheckedChange={setIsCompact}
                        aria-label={t('files.toggleCompactMode')}
                    />
                </div>
            </div>
            <Separator />
            {files.length === 0 ? (
                <div className="text-center py-8">
                    <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">{emptyTitle}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        {emptyDescription}
                    </p>
                    {showUploadButton && (
                        <Button asChild size="sm">
                            <Link to="/upload">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('files.actions.addFiles')}
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-[550px]">
                    {/* File Cards Container - Fixed height with scroll */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-elegant">
                        {files.map((file: Resource) => (
                            <FileCard
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                url={file.url}
                                description={file.description}
                                formattedSize={file.formattedSize}
                                isShared={isShared}
                                isCompact={isCompact}
                                owner={
                                    file.user
                                        ? {
                                              id: Number(file.user.id),
                                              email: file.user.email,
                                              createdAt: file.user.createdAt,
                                              profilePicture:
                                                  file.user.profilePicture ||
                                                  undefined,
                                          }
                                        : undefined
                                }
                                onFileDeleted={onFileDeleted}
                                myContacts={myContacts}
                            />
                        ))}
                    </div>
                    
                    {/* Pagination Controls - Always visible for consistent UI */}
                    {pagination && onPageChange && (
                        <div className="flex items-center justify-between pt-4 border-t bg-background">
                            <div className="text-sm text-muted-foreground">
                                {t('files.pagination.showing', {
                                    start: ((pagination.currentPage - 1) * 10) + 1,
                                    end: Math.min(pagination.currentPage * 10, pagination.totalCount),
                                    total: pagination.totalCount
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    {t('files.pagination.previous')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {t('files.pagination.page', {
                                        current: pagination.currentPage,
                                        total: pagination.totalPages
                                    })}
                                </span>
                                <Button
                                className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                >
                                    {t('files.pagination.next')}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileSection;
