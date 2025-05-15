import { Send, FileIcon, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import music from '@/assets/images/music.png';
import video from '@/assets/images/video.png'; // <-- nouveau logo vidéo

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
    const isAudio = name.match(/\.mp3$/i);
    const isVideo = name.match(/\.mp4$/i); // <-- détection vidéo
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex dark:bg-zinc-900 items-center bg-white rounded-lg shadow-md p-4 gap-4 w-full max-w-4xl">
                {/* Image à gauche */}
                <div
                    className="w-28 h-28 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() =>
                        (isImage || isAudio || isVideo) && setIsModalOpen(true)
                    }
                >
                    {isImage ? (
                        <img
                            src={url}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : isAudio ? (
                        <img
                            src={music}
                            alt="music icon"
                            className="w-12 h-12 object-contain"
                        />
                    ) : isVideo ? (
                        <img
                            src={video}
                            alt="video icon"
                            className="w-12 h-12 object-contain"
                        />
                    ) : (
                        <FileIcon className="w-12 h-12 text-gray-400" />
                    )}
                </div>

                {/* Contenu à droite */}
                <div className="flex flex-col justify-between h-full flex-grow overflow-hidden">
                    {/* Titre en haut */}
                    <h3
                        className="font-semibold text-base truncate mb-2"
                        title={name}
                    >
                        {name}
                    </h3>

                    {/* Boutons en bas */}
                    <div className="flex gap-2 items-end justify-end mt-auto">
                        <Link
                            to={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex dark:bg-zinc-500 items-center px-2 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
                        >
                            <Send className="w-4 h-4 mr-1" />
                        </Link>
                        <button
                            onClick={() => {
                                const confirmed = window.confirm(
                                    `Voulez-vous vraiment supprimer "${name}" ?`,
                                );
                                if (confirmed) {
                                    onDelete(id, name);
                                }
                            }}
                            className="inline-flex items-center px-2 py-1.5 text-sm rounded-md bg-red-400 text-white hover:bg-red-500 transition"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                        </button>
                    </div>
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

                        {isImage ? (
                            <img
                                src={url}
                                alt={name}
                                className="w-full max-h-[70vh] object-contain"
                            />
                        ) : isAudio ? (
                            <div className="p-4">
                                <audio controls className="w-full">
                                    <source src={url} type="audio/mpeg" />
                                    Votre navigateur ne supporte pas la lecture
                                    audio.
                                </audio>
                            </div>
                        ) : isVideo ? (
                            <div className="p-4">
                                <video controls className="w-full max-h-[70vh]">
                                    <source src={url} type="video/mp4" />
                                    Votre navigateur ne supporte pas la lecture
                                    vidéo.
                                </video>
                            </div>
                        ) : null}

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
