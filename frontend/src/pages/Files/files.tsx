import FileSection from '@/components/File/FileSection';
import { Loader } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import {
    GET_RESOURCES_BY_USER_ID,
    GET_SHARED_RESOURCES,
} from '@/graphql/Resource/queries';
import { GET_USER_ID } from '@/graphql/User/queries';
import { useAuthContext } from '@/context/useAuthContext';
import { useMyContacts } from '@/hooks/useMyContacts';
import { useQuery } from '@apollo/client';
import { FolderOpen, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FilesPage: React.FC = () => {
    const { t } = useTranslation();
    const { data: userData } = useQuery(GET_USER_ID);
    const { refreshAuth } = useAuthContext();
    const {
        data: resources,
        loading,
        refetch: refetchMyFiles,
    } = useQuery(GET_RESOURCES_BY_USER_ID, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id,
    });
    const { data: sharedResources } = useQuery(GET_SHARED_RESOURCES, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
    });

    const { acceptedContacts } = useMyContacts();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader size={50} />
            </div>
        );
    }

    const myFiles = resources?.getResourcesByUserId || [];
    const sharedFiles = sharedResources?.getUserSharedResources || [];

    const handleFileDeleted = () => {
        refetchMyFiles();
        refreshAuth();
    };

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
                />
            </div>
        </div>
    );
};

export default FilesPage;
