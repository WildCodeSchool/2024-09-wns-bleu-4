import { Send, FileIcon, Trash2, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import music from '@/assets/images/music.png';
import video from '@/assets/images/video.png'; // <-- nouveau logo vidéo
import { getFormattedSizeFromUrl } from '@/lib/utils';
import SendToContact from './SendToContact/SendToContact';
import { Contact } from '@/generated/graphql-types';
import { CREATE_USER_ACCESS } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/card';
import { Button } from './ui/button';

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description: string;
    onDelete: (id: number, name: string) => void;
    myContacts: Contact[];
    isShared: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    onDelete,
    myContacts,
    isShared,
}) => {
    const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isAudio = name.match(/\.mp3$/i);
    const isVideo = name.match(/\.mp4$/i); // <-- détection vidéo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [size, setSize] = useState<string | null>(null);

    useEffect(() => {
        const fetchSize = async () => {
            try {
                const fileSize = await getFormattedSizeFromUrl(url);
                setSize(fileSize);
            } catch (error) {
                console.error('Error fetching file size:', error);
            }
        };
        fetchSize();
    }, [url]);

    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);

    const handleShareToContact = async (contact: Contact) => {
        try {
            await createUserAccess({
                variables: {
                    resourceId: id,
                    userId: contact.targetUser?.id,
                },
            });
                toast.success('Fichier partagé avec succès');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erreur lors du partage du fichier');
        }
    };

    return (
        <>
            <Card className="flex flex-col w-full max-w-4xl relative">
                <div className="flex dark:bg-zinc-900 items-center rounded-lg shadow-md p-4 gap-4 w-full">
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

                        {size && (
                            <i className="font-normal text-base mb-2">
                                {size}
                            </i>
                        )}

                        {/* Boutons en bas */}
                        <div className="flex gap-2 items-end justify-end mt-auto">
                            {!isShared && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsSendModalOpen(!isSendModalOpen)}
                                    >
                                        <Send className="w-4 h-4 mr-1" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                `Voulez-vous vraiment supprimer "${name}" ?`,
                                            );
                                            if (confirmed) {
                                                onDelete(id, name);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* SendToContact component below the card */}
                {isSendModalOpen && (
                    <div className="absolute z-50 mt-2 opacity-100 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 w-full h-[144px]">
                        <div className="relative h-full">
                            <button
                                onClick={() => setIsSendModalOpen(false)}
                                className="absolute -top-2 -right-2 p-1 bg-gray-200 dark:bg-zinc-500 rounded-full hover:bg-gray-300 transition-colors z-[60]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="relative z-50 h-full flex items-center">
                                <SendToContact
                                    onSend={(contacts: Contact[]) => {
                                        contacts.forEach((contact) => {
                                            handleShareToContact(contact);
                                        });
                                        setIsSendModalOpen(false);
                                    }}
                                    myContacts={myContacts}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="rounded-lg overflow-hidden max-w-3xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 hover:text-black dark:text-white"
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
