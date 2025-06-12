import { Send, FileIcon, Trash2, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import music from '@/assets/images/music.png';
import video from '@/assets/images/video.png';
import { getFormattedSizeFromUrl } from '@/lib/utils';
import { Contact, ContactStatus } from '@/generated/graphql-types';
import { CREATE_USER_ACCESS } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthContext } from '@/context/useAuthContext';

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description: string;
    onDelete: (id: number, name: string) => void;
    myContacts: Contact[];
}

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    onDelete,
    myContacts,
}) => {
    const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isAudio = name.match(/\.mp3$/i);
    const isVideo = name.match(/\.mp4$/i);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [size, setSize] = useState<string | null>(null);
    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthContext();

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

    const getContactInfo = (contact: Contact) => {
        const currentUserEmail = user?.email;
        const isSourceUser = contact.sourceUser.email === currentUserEmail;
        const otherUser = isSourceUser ? contact.targetUser : contact.sourceUser;
        return {
            email: otherUser.email,
            user: otherUser,
        };
    };

    const filteredContacts = myContacts
        .filter(contact => contact.status === ContactStatus.Accepted)
        .filter(contact => {
            const contactInfo = getContactInfo(contact);
            return contactInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
        });

    const handleShare = async () => {
        try {
            if (selectedContacts.length === 0) {
                toast.error('Veuillez sélectionner au moins un contact');
                return;
            }

            for (const contact of selectedContacts) {
                const contactInfo = getContactInfo(contact);
                await createUserAccess({
                    variables: {
                        resourceId: id.toString(),
                        userId: contactInfo.user.id,
                    },
                });
            }
            
            toast.success('Fichier partagé avec succès');
            setSelectedContacts([]);
            setSearchQuery('');
        } catch (error) {
            console.error('Error sharing file:', error);
            toast.error('Erreur lors du partage du fichier');
        }
    };

    const toggleContact = (contact: Contact) => {
        setSelectedContacts(prev => {
            const isSelected = prev.some(c => c.id === contact.id);
            if (isSelected) {
                return prev.filter(c => c.id !== contact.id);
            } else {
                return [...prev, contact];
            }
        });
    };

    return (
        <>
            <div className="flex flex-col w-full max-w-4xl relative">
                <div className="flex dark:bg-zinc-900 items-center bg-white rounded-lg shadow-md p-4 gap-4 w-full">
                    {/* Image à gauche */}
                    <div
                        className="w-28 h-28 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                        onClick={() =>
                            (isImage || isAudio || isVideo) &&
                            setIsModalOpen(true)
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
                            <i className="font-normal text-base mb-2">{size}</i>
                        )}

                        {/* Boutons en bas */}
                        <div className="flex gap-2 items-end justify-end mt-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="inline-flex items-center px-2 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        <Send className="w-4 h-4 mr-1" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Partager le fichier</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="search">Rechercher un contact</Label>
                                            <Input
                                                id="search"
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Rechercher par email..."
                                            />
                                        </div>
                                        <div className="h-[200px] rounded-md border p-4">
                                            <ScrollArea>
                                                <div className="space-y-2">
                                                    {filteredContacts.map((contact) => {
                                                        const contactInfo = getContactInfo(contact);
                                                        return (
                                                            <div key={contact.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`contact-${contact.id}`}
                                                                    checked={selectedContacts.some(c => c.id === contact.id)}
                                                                    onCheckedChange={() => toggleContact(contact)}
                                                                />
                                                                <Label
                                                                    htmlFor={`contact-${contact.id}`}
                                                                    className="text-sm font-normal"
                                                                >
                                                                    {contactInfo.email}
                                                                </Label>
                                                            </div>
                                                        );
                                                    })}
                                                    {filteredContacts.length === 0 && (
                                                        <p className="text-sm text-gray-500 text-center">
                                                            Aucun contact trouvé
                                                        </p>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                        <Button 
                                            onClick={handleShare} 
                                            className="w-full"
                                            disabled={selectedContacts.length === 0}
                                        >
                                            Partager avec {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="destructive"
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
                            </Button>
                        </div>
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
