import FileSection from '@/components/File/FileSection';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/useAuthContext';
import {
    GET_RESOURCES_BY_USER_ID_PAGINATED,
    GET_SHARED_RESOURCES_PAGINATED,
    SEARCH_RESOURCES_BY_USER_ID,
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
    
    // Search state
    const [myFilesSearchTerm, setMyFilesSearchTerm] = useState('');
    const [isSearchingMyFiles, setIsSearchingMyFiles] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    
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
                limit: 10 
            }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id || !isSearchMode || !myFilesSearchTerm.trim(),
    });
    
    const { 
        data: sharedResources,
    } = useQuery(GET_SHARED_RESOURCES_PAGINATED, {
        variables: { 
            userId: userData?.getUserInfo?.id,
            pagination: { page: sharedFilesPage, limit: 10 }
        },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id,
    });

    const { acceptedContacts } = useMyContacts();

    const myFiles = isSearchMode 
        ? (searchResults?.searchResourcesByUserId?.resources || [])
        : (resources?.getResourcesByUserIdPaginated?.resources || []);
    const myFilesPagination = isSearchMode 
        ? searchResults?.searchResourcesByUserId
        : resources?.getResourcesByUserIdPaginated;
    const sharedFiles = sharedResources?.getUserSharedResourcesPaginated?.resources || [];
    const sharedFilesPagination = sharedResources?.getUserSharedResourcesPaginated;

    const handleFileDeleted = async () => {
        if (isSearchMode) {
            refetchSearch();
        } else {
            refetchMyFiles();
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
        if (searchTerm.trim()) {
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
    };

    // Handle search loading state
    useEffect(() => {
        if (isSearchMode && searchLoading) {
            setIsSearchingMyFiles(true);
        } else if (isSearchMode && !searchLoading) {
            setIsSearchingMyFiles(false);
        }
    }, [isSearchMode, searchLoading]);

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
                />
            </div>
        </div>
    );
};

export default FilesPage;
