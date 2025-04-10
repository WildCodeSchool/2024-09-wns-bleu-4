import { GET_RESOURCES_BY_USER_ID } from '@/graphql/Resource/queries';
import { useQuery } from '@apollo/client';
import React from 'react';
import FileCard from '../../components/FileCard';

const FilesPage: React.FC = () => {
    const userId = '1';
    const { data: graphqlData } = useQuery(GET_RESOURCES_BY_USER_ID, {
        variables: { userId: userId },
        fetchPolicy: 'cache-and-network',
    });

    const handleDelete = async () => {
        console.log('Delete file');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
                Liste des fichiers disponibles
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {graphqlData.getResourcesByUserId.map((file) => (
                    <FileCard
                        key={file.name}
                        name={file.name}
                        url={file.url}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilesPage;
