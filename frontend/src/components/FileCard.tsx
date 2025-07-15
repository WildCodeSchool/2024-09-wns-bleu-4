import { Send, FileIcon, Trash2, X, MoreVertical, Info, Flag } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import music from '@/assets/images/music.png';
import video from '@/assets/images/video.png';
import { getFormattedSizeFromUrl } from '@/lib/utils';
import { Contact, ContactStatus } from '@/generated/graphql-types';
import { CREATE_USER_ACCESS } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description: string;
    onDelete: (id: number, name: string) => void;
    myContacts: Contact[];
    isShared?: boolean;
    owner?: {
        id: number;
        email: string;
    };
}

const FileCard: React.FC<FileCardProps> = ({
    name,
    url,
    id,
    description,
    onDelete,
    myContacts,
    isShared = false,
    owner,
}) => {
    const { t } = useTranslation();
    const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isAudio = name.match(/\.mp3$/i);
    const isVideo = name.match(/\.mp4$/i);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [size, setSize] = useState<string | null>(null);
    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthContext();
    const [showFileInfo, setShowFileInfo] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);

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
                toast.error(t('fileCard.share.error.noSelection'));
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
            
            toast.success(t('fileCard.share.success'));
            setSelectedContacts([]);
            setSearchQuery('');
        } catch (error) {
            console.error('Error sharing file:', error);
            toast.error(t('fileCard.share.error.sharing'));
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

    const handleReport = (reason: string) => {
        // TODO: Implémenter l'appel à l'API pour signaler le fichier
        console.log('Signalement du fichier:', { fileId: id, reason });
        toast.success(t('fileCard.report.success'));
        setShowReportDialog(false);
    };

    const handleCloseDropdown = () => {
        // Force le DropdownMenu à se fermer proprement
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
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

                        {/* Affichage de l'expéditeur ** */}
                        {isShared && owner && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                <span className="font-medium">{t('fileCard.sharedBy')}: </span>
                                <span 
                                    className="text-blue-600 dark:text-blue-400 truncate block"
                                    title={owner.email}
                                >
                                    {owner.email}
                                </span>
                            </div>
                        )}

                        {/* Boutons en bas */}
                        <div className="flex gap-2 items-end justify-end mt-auto">
                            {/* Menu 3 points pour toutes les cartes */}
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="z-50">
                                    <DropdownMenuItem 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleCloseDropdown();
                                            setTimeout(() => setShowFileInfo(true), 100);
                                        }}
                                    >
                                        <Info className="mr-2 h-4 w-4" />
                                        {t('fileCard.menu.info')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleCloseDropdown();
                                            setTimeout(() => setShowReportDialog(true), 100);
                                        }}
                                    >
                                        <Flag className="mr-2 h-4 w-4" />
                                        {t('fileCard.menu.report')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {!isShared && (
                                <>
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
                                                <DialogTitle>{t('fileCard.share.title')}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="search">{t('fileCard.share.search.label')}</Label>
                                                    <Input
                                                        id="search"
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder={t('fileCard.share.search.placeholder')}
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
                                                                    {t('fileCard.share.noContacts')}
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
                                                    {t('fileCard.share.button', {
                                                        count: selectedContacts.length,
                                                        plural: selectedContacts.length > 1 ? 's' : ''
                                                    })}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                t('fileCard.delete.confirm', { name })
                                            );
                                            if (confirmed) {
                                                onDelete(id, name);
                                            }
                                        }}
                                        className="inline-flex items-center px-2 py-1.5 text-sm rounded-md bg-red-400 text-white hover:bg-red-500 transition"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                    </Button>
                                </>
                            )}
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
                                    {t('fileCard.preview.audio')}
                                </audio>
                            </div>
                        ) : isVideo ? (
                            <div className="p-4">
                                <video controls className="w-full max-h-[70vh]">
                                    <source src={url} type="video/mp4" />
                                    {t('fileCard.preview.video')}
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

            {/* Dialog pour les informations du fichier */}
            <Dialog open={showFileInfo} onOpenChange={setShowFileInfo} modal={true}>
                <DialogContent className="z-50">
                    <DialogHeader>
                        <DialogTitle>{t('fileCard.info.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">{t('fileCard.info.name')}</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{name}</p>
                        </div>
                        {size && (
                            <div>
                                <Label className="text-sm font-medium">{t('fileCard.info.size')}</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{size}</p>
                            </div>
                        )}
                        {description && (
                            <div>
                                <Label className="text-sm font-medium">{t('fileCard.info.description')}</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                            </div>
                        )}
                        {isShared && owner && (
                            <div>
                                <Label className="text-sm font-medium">{t('fileCard.info.owner')}</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{owner.email}</p>
                            </div>
                        )}
                        <div>
                            <Label className="text-sm font-medium">{t('fileCard.info.url')}</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{url}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog pour le signalement */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog} modal={true}>
                <DialogContent className="z-50">
                    <DialogHeader>
                        <DialogTitle>{t('fileCard.report.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t('fileCard.report.description')}
                        </p>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('fileCard.report.reason')}</Label>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('inappropriate')}
                                >
                                    {t('fileCard.report.reasons.inappropriate')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('harassment')}
                                >
                                    {t('fileCard.report.reasons.harassment')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('spam')}
                                >
                                    {t('fileCard.report.reasons.spam')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('corrupted')}
                                >
                                    {t('fileCard.report.reasons.corrupted')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('display')}
                                >
                                    {t('fileCard.report.reasons.display')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleReport('other')}
                                >
                                    {t('fileCard.report.reasons.other')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FileCard;
