import { Loader } from '@/components/Loader';
import { DELETE_RESOURCE } from '@/graphql/Resource/mutations';
import { GET_RESOURCES_BY_USER_ID } from '@/graphql/Resource/queries';
import { GET_USER_ID } from '@/graphql/User/queries';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileCard from '@/components/FileCard';

type Resource = {
    id: number;
    name: string;
    description: string;
    path: string;
    url: string;
};

const FilesPage: React.FC = () => {
    const { data: userData } = useQuery(GET_USER_ID);
    const {
        data: graphqlData,
        loading,
        error,
        refetch,
    } = useQuery(GET_RESOURCES_BY_USER_ID, {
        variables: { userId: userData?.getUserInfo?.id },
        fetchPolicy: 'cache-and-network',
        skip: !userData?.getUserInfo?.id,
    });

    const [deleteResourceMutation] = useMutation(DELETE_RESOURCE);

    const handleDelete = async (id: number, name: string) => {
        try {
            if (!id) {
                toast.error('ID de ressource non valide');
                return;
            }
            const toastId = toast.loading('Suppression en cours...');

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
                            render: 'Fichier supprimé avec succès',
                            type: 'success',
                            isLoading: false,
                            autoClose: 3000,
                        });
                    } else {
                        toast.update(toastId, {
                            render: `Erreur lors de la suppression du fichier du stockage: ${responseData.message}`,
                            type: 'error',
                            isLoading: false,
                            autoClose: 5000,
                        });
                    }
                } catch (error) {
                    console.error(error);
                    toast.update(toastId, {
                        render: 'Erreur lors de la suppression du fichier du stockage',
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                    });
                }

                await refetch();
            } else {
                toast.update(toastId, {
                    render: 'La suppression de la ressource a échoué',
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la suppression');
        }
    };

    if (error) {
        toast.error(`Erreur lors du chargement des fichiers: ${error.message}`);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 text-center">
                    {graphqlData?.getResourcesByUserId?.length
                        ? 'Liste des fichiers disponibles'
                        : "Vous n'avez pas encore de fichiers"}
                </h1>
                <Link
                    to="/upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Ajouter un fichier
                </Link>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader size={50} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {graphqlData?.getResourcesByUserId?.map(
                        (file: Resource) => (
                            <FileCard
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                url={file.url}
                                onDelete={handleDelete}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default FilesPage;