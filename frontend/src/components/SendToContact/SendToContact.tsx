import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Contact } from '@/generated/graphql-types';

interface SendToContactProps {
    onSend: (contact: Contact) => void;
    myContacts: Contact[];
}

const SendToContact = ({ onSend, myContacts }: SendToContactProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]); // This would be populated from your API

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Here you would typically fetch contacts based on the search query
        // For now, we'll use dummy data
        if (value.length > 2) {
            setContacts(myContacts);
        } else {
            setContacts([]);
        }
    };

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        setSearchQuery('');
        setContacts([]);
    };

    const handleRemoveContact = () => {
        setSelectedContact(null);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Rechercher un contact..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full max-w-[80%]"
                />
                {contacts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectContact(contact)}
                            >
                                {contact.targetUser?.email}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedContact && (
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                    <span>{selectedContact.targetUser?.email}</span>
                    <button
                        onClick={handleRemoveContact}
                        className="p-1 hover:bg-gray-200 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <Button
                onClick={() => selectedContact && onSend(selectedContact)}
                disabled={!selectedContact}
                className="w-fit self-start px-8 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-sm"
            >
                Envoyer
            </Button>
        </div>
    );
};

export default SendToContact; 