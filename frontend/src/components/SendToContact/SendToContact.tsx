import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Users } from 'lucide-react';
import { Contact, ContactStatus } from '@/generated/graphql-types';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthContext } from '@/context/useAuthContext';
<<<<<<< HEAD
import CardContact from '../Contact/CardContact';
=======
import CardContact from '@/components/Contact/CardContact';
>>>>>>> origin/dev

interface SendToContactProps {
    onSend: (contacts: Contact[]) => void;
    myContacts: Contact[];
}

const SendToContact = ({ onSend, myContacts }: SendToContactProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const { user } = useAuthContext();

    useEffect(() => {
        // Filtrer uniquement les contacts acceptés
        const acceptedContacts = myContacts.filter(
            contact => contact.status === ContactStatus.Accepted
        );
        setContacts(acceptedContacts);
    }, [myContacts]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.length > 0) {
            const filteredContacts = myContacts
                .filter(contact => contact.status === ContactStatus.Accepted)
                .filter(contact => {
                    const currentUserEmail = user?.email;
                    const isSourceUser = contact.sourceUser.email === currentUserEmail;
                    const otherUser = isSourceUser ? contact.targetUser : contact.sourceUser;
                    return otherUser.email.toLowerCase().includes(value.toLowerCase());
                });
            setContacts(filteredContacts);
        } else {
            const acceptedContacts = myContacts.filter(
                contact => contact.status === ContactStatus.Accepted
            );
            setContacts(acceptedContacts);
        }
    };

    const handleToggleContact = (contact: Contact) => {
        setSelectedContacts(prev => {
            const isSelected = prev.some(c => c.id === contact.id);
            if (isSelected) {
                return prev.filter(c => c.id !== contact.id);
            } else {
                return [...prev, contact];
            }
        });
    };

    const handleRemoveContact = (contactId: string) => {
        setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
    };

    const getContactInfo = (contact: Contact) => {
        const currentUserEmail = user?.email;
        const isSourceUser = contact.sourceUser.email === currentUserEmail;
        const otherUser = isSourceUser ? contact.targetUser : contact.sourceUser;
        return {
            email: otherUser.email,
            user: otherUser,
        };
    };

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                    Aucun contact trouvé
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    {searchQuery.length > 0 
                        ? "Aucun contact ne correspond à votre recherche."
                        : "Vous n'avez pas encore de contacts acceptés."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Rechercher un contact..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => {
                    const contactInfo = getContactInfo(contact);
                    return (
                        <div key={contact.id} className="relative">
                            <CardContact
                                email={contactInfo.email}
                                status="ACCEPTED"
                                createdAt={contact.createdAt}
                                actions={
                                    <Checkbox
                                        id={`contact-${contact.id}`}
                                        checked={selectedContacts.some(c => c.id === contact.id)}
                                        onCheckedChange={() => handleToggleContact(contact)}
                                        className="absolute top-2 right-2 z-10"
                                    />
                                }
                            />
                        </div>
                    );
                })}
            </div>

            {selectedContacts.length > 0 && (
                <div className="flex flex-col gap-2">
                    {selectedContacts.map((contact) => {
                        const contactInfo = getContactInfo(contact);
                        return (
                            <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                <span>{contactInfo.email}</span>
                                <button
                                    onClick={() => handleRemoveContact(contact.id)}
                                    className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <Button
                onClick={() => onSend(selectedContacts)}
                disabled={selectedContacts.length === 0}
                className="w-fit self-start px-8 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-sm"
            >
                Envoyer
            </Button>
        </div>
    );
};

export default SendToContact; 