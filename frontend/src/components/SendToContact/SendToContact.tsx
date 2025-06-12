import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Contact } from '@/generated/graphql-types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SendToContactProps {
    onSend: (contacts: Contact[]) => void;
    myContacts: Contact[];
}

const SendToContact = ({ onSend, myContacts }: SendToContactProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.length > 2) {
            setContacts(myContacts);
        } else {
            setContacts([]);
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
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                            >
                                <Checkbox
                                    id={`contact-${contact.id}`}
                                    checked={selectedContacts.some(c => c.id === contact.id)}
                                    onCheckedChange={() => handleToggleContact(contact)}
                                />
                                <Label
                                    htmlFor={`contact-${contact.id}`}
                                    className="flex-1 cursor-pointer"
                                >
                                    {contact.targetUser?.email}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedContacts.length > 0 && (
                <div className="flex flex-col gap-2">
                    {selectedContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                            <span>{contact.targetUser?.email}</span>
                            <button
                                onClick={() => handleRemoveContact(contact.id)}
                                className="p-1 hover:bg-gray-200 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
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