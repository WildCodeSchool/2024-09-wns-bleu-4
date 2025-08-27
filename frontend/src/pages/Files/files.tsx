import FileSection from '@/components/File/FileSection';
import { Loader } from '@/components/Loader';
<<<<<<< HEAD
import { DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { GET_RESOURCES_BY_USER_ID, GET_SHARED_RESOURCES } from '@/graphql/Resource/queries';
import { GET_USER_ID } from '@/graphql/User/queries';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileCard from '@/components/FileCard';
import { Button } from '@/components/ui/button';
import { GET_MY_CONTACTS } from '@/graphql/Contact/queries';

type Resource = {
    id: number;
    name: string;
    description: string;
    path: string;
    url: string;
};

const FilesPage: React.FC = () => {
    const { data: userData } = useQuery(GET_USER_ID);
=======
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
>>>>>>> origin/dev
    const {
        data: resources,
        loading,
        refetch: refetchMyFiles,
    } = useQuery(GET_RESOURCES_BY_USER_ID, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id,
    });
<<<<<<< HEAD

    const {
        data: sharedResources,
    } = useQuery(GET_SHARED_RESOURCES, {
=======
    const { data: sharedResources } = useQuery(GET_SHARED_RESOURCES, {
>>>>>>> origin/dev
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
    });

<<<<<<< HEAD
    console.log(sharedResources);

    const [deleteResourceMutation] = useMutation(DELETE_RESOURCE);
    const myContacts = useQuery(GET_MY_CONTACTS);
=======
    const { acceptedContacts } = useMyContacts();
>>>>>>> origin/dev

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
<<<<<<< HEAD
        <div className="container mx-auto py-8 flex flex-col gap-8">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {resources?.getResourcesByUserId?.length
                        ? 'Mes fichiers disponibles'
                        : "Vous n'avez pas encore de fichiers"}
                </h1>
                <Button
                    variant="ghost"
                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
      bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
      text-black dark:text-white transition-all duration-300 
      group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
      hover:shadow-md dark:hover:shadow-neutral-800/50"
                >
                    <Link to="/upload" className="flex items-center group">
                        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                            Ajouter des fichiers
                        </span>
                        <span
                            className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
          transition-all duration-300"
                        >
                            →
                        </span>
                    </Link>
                </Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader size={50} />
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {resources?.getResourcesByUserId?.map(
                            (file: Resource) => (
                                <FileCard
                                    key={file.id}
                                    id={file.id}
                                    name={file.name}
                                    url={file.url}
                                    description={file.description}
                                    onDelete={handleDelete}
                                    myContacts={
                                        myContacts.data?.getMyContacts
                                            ?.acceptedContacts ?? []
                                    }
                                    isShared={false}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {sharedResources?.getUserSharedResources?.length
                        ? 'Fichiers partagés avec moi'
                        : 'Aucun fichier partagé avec vous'}
                </h1>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader size={50} />
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sharedResources?.getUserSharedResources?.map(
                            (file: Resource) => (
                                <FileCard
                                    key={file.id}
                                    id={file.id}
                                    name={file.name}
                                    url={file.url}
                                    description={file.description}
                                    onDelete={() => {}}
                                    myContacts={[]}
                                    isShared={true}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
=======
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
>>>>>>> origin/dev
        </div>
    );
};

export default FilesPage;
