import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SEND_CONTACT_REQUEST } from '@/graphql/Contact/mutations';
import { GET_MY_CONTACTS } from '@/graphql/Contact/queries';
import { useMutation, useQuery } from '@apollo/client';
import { AlertTriangle, Loader2, Mail, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Contact {
    id: number;
    status: string;
    createdAt: string;
    sourceUser: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    targetUser: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}

const ContactList: React.FC = () => {
    const [targetEmail, setTargetEmail] = useState<string>('');
    const { loading, error, data } = useQuery(GET_MY_CONTACTS);
    const [sendContactRequest] = useMutation(SEND_CONTACT_REQUEST, {
        variables: { contactToCreate: { email: targetEmail } },
    });

    console.log(targetEmail);

    if (loading)
        return (
            <div className="flex items-center justify-center p-8 h-60">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                    Chargement des contacts...
                </span>
            </div>
        );
    if (error)
        return (
            <Card className="bg-destructive/10 border-destructive/20 w-full max-w-2xl mx-auto my-4">
                <CardHeader>
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                        <CardTitle className="text-destructive">
                            Erreur
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{error.message}</p>
                </CardContent>
            </Card>
        );

    const contacts = data?.getMyContacts || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="yellow">En attente</Badge>;
            case 'ACCEPTED':
                return <Badge variant="green">Accepté</Badge>;
            default:
                return <Badge variant="red">Refusé</Badge>;
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold my-8">Mes contacts</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Ajouter des contacts
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Ajouter un contact</DialogTitle>
                        <DialogDescription>
                            Vous pouvez ajouter un contact en entrant son
                            adresse e-mail.
                        </DialogDescription>
                        <Label htmlFor="email" className="mt-4">
                            Adresse e-mail
                        </Label>
                        <Input
                            value={targetEmail}
                            onChange={(e) => setTargetEmail(e.target.value)}
                        />
                        <DialogTrigger asChild className="flex justify-end mt-4">
                            <Button variant="outline" className="mr-2">
                                Annuler
                            </Button>
                            <Button>Ajouter</Button>
                        </DialogTrigger>
                    </DialogContent>
                </Dialog>
            </div>

            {contacts.length === 0 ? (
                <Card className="bg-muted/40 border-dashed border-2 text-center">
                    <CardContent className=" flex flex-col items-center py-4">
                        <User className="h-24 w-24 text-muted-foreground/60 mb-6" />
                        <p className="text-muted-foreground text-xl">
                            Vous n'avez pas encore de contacts...
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {contacts.map((contact: Contact) => (
                        <Card
                            key={contact.id}
                            className="overflow-hidden transition-all hover:shadow-md border-2"
                        >
                            <CardHeader className="flex items-center justify-between">
                                <CardDescription className="flex items-center mt-2 text-base">
                                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {contact.targetUser.email}
                                </CardDescription>

                                <div className="mt-1">
                                    {getStatusBadge(contact.status)}
                                </div>
                            </CardHeader>
                            {contact.status === 'ACCEPTED' && (
                                <CardContent className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        size="default"
                                        className="px-4"
                                    >
                                        Nos fichiers
                                    </Button>
                                    <Button size="default" className="px-4">
                                        Profil
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactList;
