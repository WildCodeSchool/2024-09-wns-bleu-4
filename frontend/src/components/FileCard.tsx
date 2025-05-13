import { Send, FileIcon, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description: string;
    onDelete: (id: number, name: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    onDelete,
}) => {
    const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 gap-4 w-full max-w-4xl">
                <div
                    className="w-28 h-28 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => isImage && setIsModalOpen(true)}
                >
                    {isImage ? (
                        <img
                            src={url}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FileIcon className="w-12 h-12 text-gray-400" />
                    )}
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <h3
                        className="font-semibold text-base truncate"
                        title={name}
                    >
                        {name}
                    </h3>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <Link
                        to={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <Send className="w-4 h-4 mr-1" />
                    </Link>
                    <button
                        onClick={() => onDelete(id, name)}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg overflow-hidden max-w-3xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-white hover:text-black"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <img
                            src={url}
                            alt={name}
                            className="w-full max-h-[70vh] object-contain"
                        />
                        <div className="p-4 pb-0">
                            <h2
                                className="text-lg font-semibold text-gray-800 truncate"
                                title={name}
                            >
                                {name}
                            </h2>
                        </div>

                        {description && (
                            <div className="p-4 text-gray-700 text-sm border-t">
                                {description}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FileCard;
