import { Eye, FileIcon, Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    onDelete: (id: number, name: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ name, url, id, onDelete }) => {
    const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl max-w-xs w-72">
            <div className="relative h-36 bg-gray-100">
                {isImage ? (
                    <img
                        src={url}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3
                    className="text-base font-semibold text-gray-800 mb-2 truncate"
                    title={name}
                >
                    {name}
                </h3>
                <div className="flex justify-between items-center">
                    <Link
                        to={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Ouvrir
                    </Link>
                    <button
                        onClick={() => onDelete(id, name)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-300"
                    >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileCard;
