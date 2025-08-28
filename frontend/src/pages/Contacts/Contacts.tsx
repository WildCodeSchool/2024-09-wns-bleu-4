import AddContactDialog from '@/components/Contact/AddContactDialog';
import ContactList from '@/components/Contact/ContactList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetMyContactsDocument } from '@/generated/graphql-types';
import { useQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contacts = () => {
    const { t } = useTranslation();
    const { data, loading, error, refetch } = useQuery(GetMyContactsDocument, {
        fetchPolicy: 'cache-and-network',
        onError: (error) => {
            console.error('Error fetching contacts:', error);
        },
    });

    const acceptedContacts = data?.getMyContacts?.acceptedContacts || [];
    const pendingRequestsReceived =
        data?.getMyContacts?.pendingRequestsReceived || [];
    const pendingRequestsSent = data?.getMyContacts?.pendingRequestsSent || [];

    const handleContactAdded = () => {
        refetch();
    };

    if (loading) {
        return (
            <section className="my-8">
                <div className="flex items-center justify-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="my-8">
                <div className="text-center py-8 text-red-500">
                    {t('contact.error')}
                </div>
            </section>
        );
    }

    return (
        <section className="my-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold">{t('contact.title')}</h1>
                <AddContactDialog
                    onContactAdded={function (): void {
                        handleContactAdded();
                    }}
                />
            </div>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="requests">
                        {t('contact.tabs.received')}
                    </TabsTrigger>
                    <TabsTrigger value="contacts">
                        {t('contact.tabs.contacts')}
                    </TabsTrigger>
                    <TabsTrigger value="sent">
                        {t('contact.tabs.sent')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="space-y-8">
                    <ContactList
                        contacts={pendingRequestsReceived}
                        type="requests"
                        onContactUpdated={handleContactAdded}
                    />
                </TabsContent>

                <TabsContent value="contacts" className="space-y-8">
                    <ContactList
                        contacts={acceptedContacts}
                        type="contacts"
                        onContactUpdated={handleContactAdded}
                    />
                </TabsContent>

                <TabsContent value="sent" className="space-y-8">
                    <ContactList
                        contacts={pendingRequestsSent}
                        type="sent"
                        onContactUpdated={handleContactAdded}
                    />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default Contacts;
