import { Loader } from '@/components/Loader';
import { DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { GET_RESOURCES_BY_USER_ID, GET_SHARED_RESOURCES } from '@/graphql/Resource/queries';
import { GET_USER_ID } from '@/graphql/User/queries';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileCard from '@/components/FileCard';
import { Button } from '@/components/ui/button';
import { GET_MY_CONTACTS } from '@/graphql/Contact/queries';
import { useTranslation } from 'react-i18next';

type Resource = {
    id: number;
    name: string;
    description: string;
    path: string;
    url: string;
    user?: {
        id: number;
        email: string;
    };
};

const FilesPage: React.FC = () => {
    const { t } = useTranslation();
    const { data: userData } = useQuery(GET_USER_ID);
    const {
        data: resources,
        loading,
        error,
        refetch,
    } = useQuery(GET_RESOURCES_BY_USER_ID, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id,
    });

    const {
        data: sharedResources,
    } = useQuery(GET_SHARED_RESOURCES, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
    });

    console.log(sharedResources);

    const [deleteResourceMutation] = useMutation(DELETE_RESOURCE);
    const myContacts = useQuery(GET_MY_CONTACTS);

    const handleDelete = async (id: number, name: string) => {
        try {
            if (!id) {
                toast.error(t('files.errors.invalidResourceId'));
                return;
            }
            const toastId = toast.loading(t('files.errors.deleting'));

            const { data } = await deleteResourceMutation({
                variables: { deleteResourceId: id.toString() },
            });

            if (data && data.deleteResource === 'Resource deleted') {
                try {
                    const response = await fetch(
                        `/storage/delete/${encodeURIComponent(
                            name.replace(/ /g, '_'),
                        )}`,
                        {
                            method: 'DELETE',
                        },
                    );

                    const responseData = await response.json();

                    if (response.ok) {
                        toast.update(toastId, {
                            render: t('files.errors.deleteSuccess'),
                            type: 'success',
                            isLoading: false,
                            autoClose: 3000,
                        });
                    } else {
                        toast.update(toastId, {
                            render: `${t('files.errors.storageDeleteError')}: ${responseData.message}`,
                            type: 'error',
                            isLoading: false,
                            autoClose: 5000,
                        });
                    }
                } catch (error) {
                    console.error(error);
                    toast.update(toastId, {
                        render: t('files.errors.storageDeleteError'),
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                    });
                }

                await refetch();
            } else {
                toast.update(toastId, {
                    render: t('files.errors.deleteError'),
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(t('files.errors.deleteError'));
        }
    };

    if (error) {
        toast.error(`${t('files.errors.loadError')}: ${error.message}`);
    }

    return (
        <div className="container mx-auto py-8 flex flex-col gap-8">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {resources?.getResourcesByUserId?.length
                        ? t('files.title.myFiles')
                        : t('files.title.noFiles')}
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
                            {t('files.actions.addFiles')}
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
                        ? t('files.title.sharedFiles')
                        : t('files.title.noSharedFiles')}
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
                                    owner={file.user}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilesPage;
