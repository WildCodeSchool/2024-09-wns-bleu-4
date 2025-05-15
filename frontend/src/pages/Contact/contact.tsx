import AddContactDialog from '@/components/Contact/AddContactDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Contact = () => {
    const handleContactAdded = () => {
        window.location.reload();
    };

    return (
        <section className="mx-auto my-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold">Contacts</h1>
                <AddContactDialog onContactAdded={handleContactAdded} />
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="requests">Demandes</TabsTrigger>
                    <TabsTrigger value="contacts">Mes contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8"></TabsContent>

                <TabsContent value="requests">
                    <div className="space-y-8"></div>
                </TabsContent>

                <TabsContent value="contacts"></TabsContent>
            </Tabs>
        </section>
    );
};

export default Contact;
