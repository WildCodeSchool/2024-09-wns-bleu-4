import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import FileCard from '../../components/FileCard';
import HeadMeta from '@/components/HeadMeta';

interface File {
    name: string;
    url: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// React.FR fait le typage automatiquement des props
const FilesPage: React.FC = () => {
    const { data, mutate } = useSWR('/storage/files', fetcher);

    const files: File[] =
        data?.files.map((filename: string) => ({
            name: filename,
            url: `/storage/uploads/${filename}`,
        })) || [];

    const handleDelete = async (filename: string) => {
        await axios.delete(`/storage/delete/${filename}`);
        mutate(); // Rafraichi la liste
    };

    return (
        <>
            <HeadMeta
                title="Mes fichiers"
                description="Liste de tous vos fichiers"
            />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Liste des fichiers disponibles
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <FileCard
                            key={file.name}
                            name={file.name}
                            url={file.url}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default FilesPage;
