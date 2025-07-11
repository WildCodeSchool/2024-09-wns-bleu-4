import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/useAuthContext';
import {
    AcceptContactRequestDocument,
    Contact,
    ContactStatus,
    RefuseContactRequestDocument,
} from '@/generated/graphql-types';
import { gql, useMutation } from '@apollo/client';
import { Check, Clock, Mail, UserMinus, Users, X } from 'lucide-react';
import React from 'react';
import CardContact from './CardContact';
import { useTranslation } from 'react-i18next';

const REMOVE_CONTACT = gql`
    mutation RemoveContact($contactId: ID!) {
        removeContact(contactId: $contactId)
    }
`;

interface ContactListProps {
    contacts: Contact[];
    type: 'requests' | 'contacts' | 'sent';
    onContactUpdated?: () => void;
}

const ContactList: React.FC<ContactListProps> = ({
    contacts,
    type,
    onContactUpdated,
}) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();

    const mapContactStatusToCardStatus = (
        status: ContactStatus,
    ): 'PENDING' | 'ACCEPTED' | 'REFUSED' | undefined => {
        switch (status) {
            case ContactStatus.Pending:
                return 'PENDING';
            case ContactStatus.Accepted:
                return 'ACCEPTED';
            case ContactStatus.Refused:
                return 'REFUSED';
            default:
                return undefined;
        }
    };

    const [acceptContact] = useMutation(AcceptContactRequestDocument, {
        onCompleted: () => onContactUpdated?.(),
        onError: (error) =>
            console.error("Erreur lors de l'acceptation:", error),
    });

    const [refuseContact] = useMutation(RefuseContactRequestDocument, {
        onCompleted: () => onContactUpdated?.(),
        onError: (error) => console.error('Erreur lors du refus:', error),
    });

    const [removeContact] = useMutation(REMOVE_CONTACT, {
        onCompleted: () => onContactUpdated?.(),
        onError: (error) =>
            console.error('Erreur lors de la suppression:', error),
    });

    const handleAccept = async (contactId: string) => {
        try {
            await acceptContact({
                variables: { contactId },
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleRefuse = async (contactId: string) => {
        try {
            await refuseContact({
                variables: { contactId },
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleRemove = async (contactId: string) => {
        try {
            await removeContact({
                variables: { contactId },
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const getContactInfo = (contact: Contact) => {
        switch (type) {
            case 'requests':
                return {
                    email: contact.sourceUser.email,
                    user: contact.sourceUser,
                };
            case 'sent':
                return {
                    email: contact.targetUser.email,
                    user: contact.targetUser,
                };
            case 'contacts': {
                const currentUserEmail = user?.email;
                const isSourceUser =
                    contact.sourceUser.email === currentUserEmail;
                const otherUser = isSourceUser
                    ? contact.targetUser
                    : contact.sourceUser;
                return {
                    email: otherUser.email,
                    user: otherUser,
                };
            }
            default:
                return {
                    email: contact.sourceUser.email,
                    user: contact.sourceUser,
                };
        }
    };

    const getEmptyMessage = () => {
        switch (type) {
            case 'requests':
                return {
                    icon: <Mail className="w-12 h-12 text-gray-400" />,
                    title: t('contact.empty.requests.title'),
                    description: t('contact.empty.requests.description'),
                };
            case 'contacts':
                return {
                    icon: <Users className="w-12 h-12 text-gray-400" />,
                    title: t('contact.empty.contacts.title'),
                    description: t('contact.empty.contacts.description'),
                };
            case 'sent':
                return {
                    icon: <Clock className="w-12 h-12 text-gray-400" />,
                    title: t('contact.empty.sent.title'),
                    description: t('contact.empty.sent.description'),
                };
            default:
                return {
                    icon: <Users className="w-12 h-12 text-gray-400" />,
                    title: t('contact.empty.default.title'),
                    description: t('contact.empty.default.description'),
                };
        }
    };

    if (contacts.length === 0) {
        const emptyMessage = getEmptyMessage();
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                {emptyMessage.icon}
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                    {emptyMessage.title}
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    {emptyMessage.description}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => {
                const contactInfo = getContactInfo(contact);
                const cardStatus = mapContactStatusToCardStatus(contact.status);
                let actions = null;

                if (
                    type === 'requests' &&
                    contact.status === ContactStatus.Pending
                ) {
                    actions = (
                        <>
                            <Button
                                size="sm"
                                onClick={() => handleAccept(contact.id)}
                                className="flex-1"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                {t('contact.actions.accept')}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRefuse(contact.id)}
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-1" />
                                {t('contact.actions.refuse')}
                            </Button>
                        </>
                    );
                }

                if (
                    type === 'contacts' &&
                    contact.status === ContactStatus.Accepted
                ) {
                    actions = (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                >
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    {t('contact.actions.remove')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {t('contact.delete.title')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('contact.delete.description', { email: contactInfo.email })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {t('contact.actions.cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleRemove(contact.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {t('contact.actions.delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    );
                }

                return (
                    <CardContact
                        key={contact.id}
                        email={contactInfo.email}
                        status={cardStatus}
                        createdAt={contact.createdAt}
                        actions={actions}
                    />
                );
            })}
        </div>
    );
};

export default ContactList;
