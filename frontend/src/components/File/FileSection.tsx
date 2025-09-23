import FileCard from '@/components/File/FileCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Contact, Resource } from '@/generated/graphql-types';
import { ChevronLeft, ChevronRight, LucideIcon, Plus, Search, RotateCcw, X, Filter, Users } from 'lucide-react';
import { 
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    onSearch?: (searchTerm: string) => void;
    onSortByRecent?: () => void;
    isSearching?: boolean;
    selectedTypes?: string[];
    onTypesChange?: (types: string[]) => void;
    // Shared-only author filter
    authorOptions?: { id: number; email: string; profilePicture?: string | null }[];
    selectedAuthorId?: number | null;
    onAuthorChange?: (authorId: number | null) => void;
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
    onSearch,
    onSortByRecent,
    selectedTypes = [],
    onTypesChange,
    authorOptions = [],
    selectedAuthorId = null,
    onAuthorChange,
}) => {
    const { t } = useTranslation();
    const [isCompact, setIsCompact] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const typeOptions: { key: string; label: string }[] = [
        { key: 'image', label: t('files.types.image') || 'Image' },
        { key: 'video', label: t('files.types.video') || 'Video' },
        { key: 'pdf', label: 'PDF' },
        { key: 'audio', label: t('files.types.audio') || 'Audio' },
        { key: 'archive', label: t('files.types.archive') || 'Archive' },
        { key: 'document', label: t('files.types.document') || 'Document' },
        { key: 'spreadsheet', label: t('files.types.spreadsheet') || 'Spreadsheet' },
        { key: 'code', label: t('files.types.code') || 'Code' },
    ];

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSortByRecent = () => {
        // Clear local input content
        setSearchTerm('');
        if (onSortByRecent) {
            onSortByRecent();
        }
    };

    const toggleType = (key: string, checked: boolean | string) => {
        if (!onTypesChange) return;
        const isChecked = !!checked;
        const next = isChecked
            ? Array.from(new Set([...(selectedTypes || []), key]))
            : (selectedTypes || []).filter((t) => t !== key);
        onTypesChange(next);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Badge variant="secondary">
                        {pagination ? pagination.totalCount : files.length}
                        <span className="text-sm text-muted-foreground ml-1">
                            {t('files.results')}
                        </span>
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
            
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('files.search.placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 pr-4"
                    />
                    {searchTerm && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            aria-label={t('common.clear')}
                            onClick={() => {
                                setSearchTerm('');
                                if (onSortByRecent) onSortByRecent();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button
                    className="cursor-pointer"
                    onClick={handleSearch}
                    size="sm"
                    variant="outline"
                >
                    <Search className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="cursor-pointer"
                            size="sm"
                            variant="outline"
                            title={t('files.filterByType')}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{t('files.filterTypes') || 'Types'}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {typeOptions.map((opt) => (
                            <DropdownMenuCheckboxItem
                                key={opt.key}
                                checked={selectedTypes?.includes(opt.key)}
                                onCheckedChange={(checked) => toggleType(opt.key, checked)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {opt.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {isShared && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="cursor-pointer"
                                size="sm"
                                variant="outline"
                                title={t('files.filterByAuthor')}
                            >
                                <Users className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64">
                            <DropdownMenuLabel>{t('files.filterAuthors') || 'Authors'}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ScrollArea className="h-56 w-full">
                                <div className="py-1">
                                    <DropdownMenuCheckboxItem
                                        checked={selectedAuthorId === null}
                                        onCheckedChange={(checked) => {
                                            if (checked && onAuthorChange) {
                                                onAuthorChange(null);
                                            }
                                        }}
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {t('files.allAuthors') || 'All authors'}
                                    </DropdownMenuCheckboxItem>
                                    {authorOptions.map((a) => (
                                        <DropdownMenuCheckboxItem
                                            key={Number(a.id)}
                                            checked={selectedAuthorId === Number(a.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked && onAuthorChange) {
                                                    onAuthorChange(Number(a.id));
                                                }
                                            }}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            {a.email}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </div>
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <Button
                    className="cursor-pointer"
                    onClick={handleSortByRecent}
                    size="sm"
                    variant="outline"
                    title={t('files.reset')}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
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
