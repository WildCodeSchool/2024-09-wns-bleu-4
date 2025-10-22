import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

interface FileGroupShareDialogProps {
    fileIds: number[];
    fileCount: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    myContacts: Contact[];
}

const FileGroupShareDialog: React.FC<FileGroupShareDialogProps> = ({
    fileIds,
    fileCount,
    isOpen,
    onOpenChange,
    myContacts,
}) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [createUserAccess] = useMutation(CREATE_USER_ACCESS);
    
    // Fetch users who already have access to the first resource (for checking already shared contacts)
    const { data: usersWithAccessData } = useQuery(GET_USERS_WITH_ACCESS, {
        variables: { resourceId: fileIds[0] },
        skip: !fileIds.length,
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
                toast.error(t('files.groupShareDialog.error.noSelection'));
                return;
            }

            let successCount = 0;
            let errorCount = 0;

            // Share each file with each selected contact
            for (const fileId of fileIds) {
                for (const contact of selectedContacts) {
                    try {
                        const contactInfo = getContactInfo(contact);
                        await createUserAccess({
                            variables: {
                                resourceId: fileId.toString(),
                                userId: contactInfo.user.id,
                            },
                        });
                        successCount++;
                    } catch {
                        errorCount++;
                    }
                }
            }

            // Show appropriate toast messages
            if (errorCount === 0) {
                toast.success(t('files.groupShareDialog.success', { 
                    count: fileCount,
                    contacts: selectedContacts.length 
                }));
            } else if (successCount > 0) {
                toast.warn(t('files.groupShareDialog.partialSuccess', { 
                    success: successCount, 
                    total: fileIds.length * selectedContacts.length 
                }));
            } else {
                toast.error(t('files.groupShareDialog.error.sharing'));
            }

            // Reset form
            setSelectedContacts([]);
            setSearchQuery('');
            onOpenChange(false);
        } catch {
            toast.error(t('files.groupShareDialog.error.sharing'));
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('files.groupShareDialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('files.groupShareDialog.description', { count: fileCount })}
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
                        {t('files.groupShareDialog.button', {
                            count: fileCount,
                            contacts: selectedContacts.length,
                        })}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileGroupShareDialog;
