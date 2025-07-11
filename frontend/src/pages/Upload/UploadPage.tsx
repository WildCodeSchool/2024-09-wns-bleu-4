import FileUploader from '@/components/FileUploader/FileUploader';
import { CREATE_RESOURCE, CREATE_USER_ACCESS } from '@/graphql/Resource/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { mutate } from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { Contact } from '@/generated/graphql-types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'react-toastify';
import { useGetMyContactsQuery } from '@/generated/graphql-types';
import { Loader, Share2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [lastUploadedResourceId, setLastUploadedResourceId] = useState<string | null>(null);
    const { user } = useAuth();
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: contactsData, loading: contactsLoading } = useGetMyContactsQuery();
    const myContacts = contactsData?.getMyContacts?.acceptedContacts || [];

    const [createResource] = useMutation(CREATE_RESOURCE);
    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);

    const acceptedFileTypes = {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
        'audio/*': ['.mp3', '.wav'],
        'video/*': ['.mp4', '.mov'],
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !user?.id) return;

        setIsUploading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const secureName = file.name.replace(/\s+/g, '_');
            const fileUrl = `/storage/uploads/${secureName}`;

            const resourceResponse = await createResource({
                variables: {
                    data: {
                        name: file.name,
                        path: fileUrl,
                        url: fileUrl,
                        description:
                            description || `Fichier uploadé : ${file.name}`,
                        userId: user.id,
                    },
                },
            });

            if (resourceResponse.data?.createResource) {
                const formData = new FormData();
                formData.append('file', file);

                const storageUrl = `/storage/upload?filename=${encodeURIComponent(
                    secureName,
                )}`;
                const storageResponse = await fetch(storageUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!storageResponse.ok) {
                    throw new Error("Erreur lors de l'upload du fichier");
                }

                setLastUploadedResourceId(resourceResponse.data.createResource.id);
                setFile(null);
                setDescription('');
                mutate('/storage/files');
                setSuccessMessage(
                    '✅ Le fichier a été envoyé et enregistré avec succès !',
                );
            }
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            setErrorMessage(
                "❌ Une erreur s'est produite. Veuillez réessayer.",
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleShare = async () => {
        if (selectedContacts.length === 0) {
            toast.error('Veuillez sélectionner au moins un contact');
            return;
        }

        if (!lastUploadedResourceId) {
            toast.error('Une erreur est survenue lors du partage');
            return;
        }

        try {
            for (const contact of selectedContacts) {
                await createUserAccess({
                    variables: {
                        resourceId: lastUploadedResourceId,
                        userId: contact.targetUser.id,
                    },
                });
            }
            
            toast.success('Fichier partagé avec succès');
            setSelectedContacts([]);
            setSearchQuery('');
            setIsShareModalOpen(false);
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
        <div className="mx-auto grid grid-cols-1 gap-8 items-start max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold my-8">
                    Transférez votre fichier
                </h1>
    
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FileUploader
                        onFileChange={setFile}
                        onDescriptionChange={setDescription}
                        description={description}
                        isUploading={isUploading}
                        successMessage={
                            successMessage && (
                                <div className="flex items-center gap-4">
                                    <span>{successMessage}</span>
                                    <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Share2 className="w-4 h-4" />
                                                Partager maintenant
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Partager le fichier</DialogTitle>
                                                <DialogDescription>
                                                    Sélectionnez les contacts avec lesquels vous souhaitez partager ce fichier.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {contactsLoading ? (
                                                <div className="flex items-center justify-center py-12">
                                                    <Loader className="h-8 w-8 animate-spin text-primary" />
                                                </div>
                                            ) : (
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
                                                                {myContacts
                                                                    .filter(contact => 
                                                                        contact.targetUser.email.toLowerCase().includes(searchQuery.toLowerCase())
                                                                    )
                                                                    .map((contact) => (
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
                                                                                {contact.targetUser.email}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                {myContacts.filter(contact => 
                                                                    contact.targetUser.email.toLowerCase().includes(searchQuery.toLowerCase())
                                                                ).length === 0 && (
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
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )
                        }
                        errorMessage={errorMessage}
                        acceptedFileTypes={acceptedFileTypes}
                    />
                </form>
            </div>
        </div>
    );
};

export default UploadPage;
