import FileSection from '@/components/File/FileSection';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/useAuthContext';
import {
    GET_RESOURCES_BY_USER_ID_PAGINATED,
    GET_SHARED_RESOURCES_PAGINATED,
    SEARCH_RESOURCES_BY_USER_ID,
    SEARCH_SHARED_RESOURCES_BY_USER_ID,
    GET_AUTHORS_WHO_SHARED_WITH_USER,
} from '@/graphql/Resource/queries';
import { GET_USER_ID } from '@/graphql/User/queries';
import { useMyContacts } from '@/hooks/useMyContacts';
import { useQuery } from '@apollo/client';
import { FolderOpen, Plus, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FilesPage: React.FC = () => {
    const { t } = useTranslation();
    const { data: userData } = useQuery(GET_USER_ID);
    const { refreshAuth } = useAuthContext();
    
    // Pagination state
    const [myFilesPage, setMyFilesPage] = useState(1);
    const [sharedFilesPage, setSharedFilesPage] = useState(1);
    
    // Search / filter state for my files
    const [myFilesSearchTerm, setMyFilesSearchTerm] = useState('');
    const [isSearchingMyFiles, setIsSearchingMyFiles] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    
    // Search / filter state for shared files
    const [sharedFilesSearchTerm, setSharedFilesSearchTerm] = useState('');
    const [isSearchingSharedFiles, setIsSearchingSharedFiles] = useState(false);
    const [isSharedSearchMode, setIsSharedSearchMode] = useState(false);
    const [selectedSharedTypes, setSelectedSharedTypes] = useState<string[]>([]);
    const [authors, setAuthors] = useState<{ id: number; email: string; profilePicture?: string | null }[]>([]);
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    
    const {
        data: resources,
        refetch: refetchMyFiles,
    } = useQuery(GET_RESOURCES_BY_USER_ID_PAGINATED, {
        variables: { 
            userId: userData?.getUserInfo?.id,
            pagination: { page: myFilesPage, limit: 10 }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id || isSearchMode,
    });

    const {
        data: searchResults,
        refetch: refetchSearch,
        loading: searchLoading,
    } = useQuery(SEARCH_RESOURCES_BY_USER_ID, {
        variables: { 
            userId: userData?.getUserInfo?.id,
            search: { 
                searchTerm: myFilesSearchTerm, 
                page: myFilesPage, 
                limit: 10,
                types: selectedTypes.length ? selectedTypes : null,
            }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id || !isSearchMode || (!myFilesSearchTerm.trim() && selectedTypes.length === 0),
    });
    
    const { 
        data: sharedResources,
        refetch: refetchSharedFiles,
    } = useQuery(GET_SHARED_RESOURCES_PAGINATED, {
        variables: { 
            userId: userData?.getUserInfo?.id,
            pagination: { page: sharedFilesPage, limit: 10 }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id || isSharedSearchMode,
    });

    const {
        data: sharedSearchResults,
        refetch: refetchSharedSearch,
        loading: sharedSearchLoading,
    } = useQuery(SEARCH_SHARED_RESOURCES_BY_USER_ID, {
        variables: { 
            userId: userData?.getUserInfo?.id,
            search: { 
                searchTerm: sharedFilesSearchTerm || '', 
                page: sharedFilesPage, 
                limit: 10,
                types: selectedSharedTypes.length ? selectedSharedTypes : null,
                authorId: selectedAuthorId,
            }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id || !isSharedSearchMode,
    });

    const { acceptedContacts } = useMyContacts();

    const myFiles = isSearchMode 
        ? (searchResults?.searchResourcesByUserId?.resources || [])
        : (resources?.getResourcesByUserIdPaginated?.resources || []);
    const myFilesPagination = isSearchMode 
        ? searchResults?.searchResourcesByUserId
        : resources?.getResourcesByUserIdPaginated;
    const sharedFiles = isSharedSearchMode 
        ? (sharedSearchResults?.searchSharedResourcesByUserId?.resources || [])
        : (sharedResources?.getUserSharedResourcesPaginated?.resources || []);
    const sharedFilesPagination = isSharedSearchMode 
        ? sharedSearchResults?.searchSharedResourcesByUserId
        : sharedResources?.getUserSharedResourcesPaginated;

    const handleFileDeleted = async () => {
        if (isSearchMode) {
            refetchSearch();
        } else {
            refetchMyFiles();
        }
        if (isSharedSearchMode) {
            refetchSharedSearch();
        } else {
            refetchSharedFiles();
        }
        await refreshAuth();
    };

    const handleMyFilesPageChange = (page: number) => {
        setMyFilesPage(page);
    };

    const handleSharedFilesPageChange = (page: number) => {
        setSharedFilesPage(page);
    };

    const handleMyFilesSearch = (searchTerm: string) => {
        setMyFilesSearchTerm(searchTerm);
        if (searchTerm.trim() || selectedTypes.length > 0) {
            setIsSearchMode(true);
            setIsSearchingMyFiles(true);
            // Reset to first page when searching
            setMyFilesPage(1);
        } else {
            setIsSearchMode(false);
            setIsSearchingMyFiles(false);
        }
    };

    const handleSortByRecent = () => {
        setIsSearchMode(false);
        setMyFilesSearchTerm('');
        setIsSearchingMyFiles(false);
        setMyFilesPage(1);
        setSelectedTypes([]);
    };

    const handleTypesChange = (types: string[]) => {
        setSelectedTypes(types);
        if (types.length > 0 || myFilesSearchTerm.trim()) {
            setIsSearchMode(true);
            setMyFilesPage(1);
        } else {
            setIsSearchMode(false);
        }
    };

    const handleSharedFilesSearch = (searchTerm: string) => {
        setSharedFilesSearchTerm(searchTerm);
        if (searchTerm.trim() || selectedSharedTypes.length > 0) {
            setIsSharedSearchMode(true);
            setIsSearchingSharedFiles(true);
            // Reset to first page when searching
            setSharedFilesPage(1);
        } else {
            setIsSharedSearchMode(false);
            setIsSearchingSharedFiles(false);
        }
    };

    const handleSharedSortByRecent = () => {
        setIsSharedSearchMode(false);
        setSharedFilesSearchTerm('');
        setIsSearchingSharedFiles(false);
        setSharedFilesPage(1);
        setSelectedSharedTypes([]);
        setSelectedAuthorId(null);
    };

    const handleSharedTypesChange = (types: string[]) => {
        setSelectedSharedTypes(types);
        if (types.length > 0 || sharedFilesSearchTerm.trim()) {
            setIsSharedSearchMode(true);
            setSharedFilesPage(1);
        } else {
            setIsSharedSearchMode(false);
        }
    };

    const handleAuthorChange = (authorId: number | null) => {
        setSelectedAuthorId(authorId);
        if (authorId !== null || selectedSharedTypes.length > 0 || sharedFilesSearchTerm.trim()) {
            setIsSharedSearchMode(true);
            setSharedFilesPage(1);
        } else {
            setIsSharedSearchMode(false);
        }
    };

    // Grouped actions handlers
    const handleMyFilesGroupedAction = async (action: string, fileIds: number[]) => {
        console.log('My files grouped action:', action, fileIds);
        // TODO: Implement grouped actions for my files
        // This would typically involve:
        // - Share: Open share dialog for multiple files
        // - Report: Report multiple files
        // - Delete: Delete multiple files
        switch (action) {
            case 'share':
                // Open share dialog for multiple files
                break;
            case 'report':
                // Report multiple files
                break;
            case 'delete':
                // Delete multiple files
                break;
            default:
                console.warn('Unknown grouped action:', action);
        }
    };

    const handleSharedFilesGroupedAction = async (action: string, fileIds: number[]) => {
        console.log('Shared files grouped action:', action, fileIds);
        // TODO: Implement grouped actions for shared files
        // Note: Delete action should not be available for shared files
        switch (action) {
            case 'share':
                // Open share dialog for multiple files
                break;
            case 'report':
                // Report multiple files
                break;
            default:
                console.warn('Unknown grouped action:', action);
        }
    };

    // Handle search loading state
    useEffect(() => {
        if (isSearchMode && searchLoading) {
            setIsSearchingMyFiles(true);
        } else if (isSearchMode && !searchLoading) {
            setIsSearchingMyFiles(false);
        }
    }, [isSearchMode, searchLoading]);

    useEffect(() => {
        if (isSharedSearchMode && sharedSearchLoading) {
            setIsSearchingSharedFiles(true);
        } else if (isSharedSearchMode && !sharedSearchLoading) {
            setIsSearchingSharedFiles(false);
        }
    }, [isSharedSearchMode, sharedSearchLoading]);

    // Load authors for shared files dropdown
    const { data: authorsData } = useQuery(GET_AUTHORS_WHO_SHARED_WITH_USER, {
        variables: { userId: userData?.getUserInfo?.id },
        skip: !userData?.getUserInfo?.id,
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (authorsData?.getAuthorsWhoSharedWithUser) {
            type AuthorGQL = { id: string | number; email: string; profilePicture?: string | null };
            const normalized = (authorsData.getAuthorsWhoSharedWithUser as AuthorGQL[])
                .filter(Boolean)
                .map((a) => ({ id: Number(a.id), email: a.email, profilePicture: a.profilePicture ?? null }));
            setAuthors(normalized);
        }
    }, [authorsData]);

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('files.title.myFiles')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('files.description')}
                    </p>
                </div>
                <Button asChild>
                    <Link to="/upload">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('files.actions.addFiles')}
                    </Link>
                </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mes fichiers */}
                <FileSection
                    title={t('files.title.myFilesSection')}
                    icon={FolderOpen}
                    files={myFiles}
                    emptyTitle={t('files.title.noFiles')}
                    emptyDescription={t('files.emptyState.noFilesDescription')}
                    isShared={false}
                    onFileDeleted={handleFileDeleted}
                    myContacts={acceptedContacts}
                    showUploadButton={true}
                    pagination={myFilesPagination}
                    onPageChange={handleMyFilesPageChange}
                    onSearch={handleMyFilesSearch}
                    onSortByRecent={handleSortByRecent}
                    isSearching={isSearchingMyFiles}
                    selectedTypes={selectedTypes}
                    onTypesChange={handleTypesChange}
                    onGroupedAction={handleMyFilesGroupedAction}
                />

                {/* Fichiers partagés */}
                <FileSection
                    title={t('files.title.sharedFilesSection')}
                    icon={Users}
                    files={sharedFiles}
                    emptyTitle={t('files.title.noSharedFiles')}
                    emptyDescription={t(
                        'files.emptyState.noSharedFilesDescription',
                    )}
                    isShared={true}
                    pagination={sharedFilesPagination}
                    onPageChange={handleSharedFilesPageChange}
                    onSearch={handleSharedFilesSearch}
                    onSortByRecent={handleSharedSortByRecent}
                    isSearching={isSearchingSharedFiles}
                    selectedTypes={selectedSharedTypes}
                    onTypesChange={handleSharedTypesChange}
                    authorOptions={authors}
                    selectedAuthorId={selectedAuthorId}
                    onAuthorChange={handleAuthorChange}
                    onGroupedAction={handleSharedFilesGroupedAction}
                />
            </div>
        </div>
    );
};

export default FilesPage;
