import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthContext } from '@/context/useAuthContext';
import { Contact, ContactStatus } from '@/generated/graphql-types';
import { CREATE_USER_ACCESS } from '@/graphql/Resource/mutations';
import { GET_USERS_WITH_ACCESS } from '@/graphql/Resource/queries';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface FileShareDialogProps {
    trigger: React.ReactNode;
    resourceId: string;
    fileName: string;
    myContacts: Contact[];
}

const FileShareDialog: React.FC<FileShareDialogProps> = ({
    trigger,
    resourceId,
    fileName,
    myContacts,
}) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);
    
    // Fetch users who already have access to this resource
    const { data: usersWithAccessData, refetch: refetchUsersWithAccess } = useQuery(GET_USERS_WITH_ACCESS, {
        variables: { resourceId: Number(resourceId) },
        skip: !resourceId,
    });
    
    const usersWithAccess = usersWithAccessData?.getUsersWithAccess || [];

    const getContactInfo = (contact: Contact) => {
        const currentUserEmail = user?.email;
        const isSourceUser = contact.sourceUser.email === currentUserEmail;
        const otherUser = isSourceUser
            ? contact.targetUser
            : contact.sourceUser;
        return {
            email: otherUser.email,
            user: otherUser,
        };
    };

    const isContactAlreadyShared = (contact: Contact) => {
        const contactInfo = getContactInfo(contact);
        const isShared = usersWithAccess.some((user: { id: string }) => user.id === String(contactInfo.user.id));
        return isShared;
    };

    const filteredContacts = myContacts
        .filter((contact) => contact.status === ContactStatus.Accepted)
        .filter((contact) => {
            const contactInfo = getContactInfo(contact);
            return contactInfo.email
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
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
                        resourceId: resourceId,
                        userId: contactInfo.user.id,
                    },
                });
            }

            // Refetch the users with access to update the UI
            await refetchUsersWithAccess();

            toast.success(t('fileCard.share.success'));
            setSelectedContacts([]);
            setSearchQuery('');
            // Le dialog se fermera automatiquement
        } catch {
            toast.error(t('fileCard.share.error.sharing'));
        }
    };

    const toggleContact = (contact: Contact) => {
        setSelectedContacts((prev) => {
            const isSelected = prev.some((c) => c.id === contact.id);
            if (isSelected) {
                return prev.filter((c) => c.id !== contact.id);
            } else {
                return [...prev, contact];
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('fileCard.share.title')}</DialogTitle>
                    <DialogDescription>
                        {t('fileCard.share.description', { fileName })}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">
                            {t('fileCard.share.search.label')}
                        </Label>
                        <Input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('fileCard.share.search.placeholder')}
                        />
                    </div>
                    <div className="h-[200px] rounded-md border p-4">
                        <ScrollArea className="h-full">
                            <div className="space-y-2">
                                {filteredContacts.map((contact) => {
                                    const contactInfo = getContactInfo(contact);
                                    const isAlreadyShared = isContactAlreadyShared(contact);
                                    return (
                                        <div
                                            key={contact.id}
                                            className={`flex items-center space-x-2 ${
                                                isAlreadyShared ? 'opacity-50' : ''
                                            }`}
                                        >
                                            <Checkbox
                                                id={`contact-${contact.id}`}
                                                checked={selectedContacts.some(
                                                    (c) => c.id === contact.id,
                                                )}
                                                disabled={isAlreadyShared}
                                                onCheckedChange={() =>
                                                    !isAlreadyShared && toggleContact(contact)
                                                }
                                            />
                                            <Label
                                                htmlFor={`contact-${contact.id}`}
                                                className={`text-sm font-normal flex-1 ${
                                                    isAlreadyShared 
                                                        ? 'cursor-not-allowed text-muted-foreground' 
                                                        : 'cursor-pointer'
                                                }`}
                                            >
                                                {contactInfo.email}
                                                {isAlreadyShared && (
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({t('fileCard.share.alreadyShared')})
                                                    </span>
                                                )}
                                            </Label>
                                        </div>
                                    );
                                })}
                                {filteredContacts.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
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
                            plural: selectedContacts.length > 1 ? 's' : '',
                        })}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileShareDialog;
