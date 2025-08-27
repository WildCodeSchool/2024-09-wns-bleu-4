import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SEND_CONTACT_REQUEST } from '@/graphql/Contact/mutations';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
<<<<<<< HEAD
=======
import { useTranslation } from 'react-i18next';
>>>>>>> origin/dev

interface AddContactDialogProps {
    onContactAdded: () => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({
    onContactAdded,
}) => {
<<<<<<< HEAD
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const contactFormSchema = z.object({
        email: z.string().email('Email invalide').min(1, "L'email est requis"),
=======
    const { t } = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const contactFormSchema = z.object({
        email: z.string().email(t('contact.add.form.email.invalid')).min(1, t('contact.add.form.email.required')),
>>>>>>> origin/dev
    });

    const [sendContactRequest, { loading: sendingRequest, error: sendError }] =
        useMutation(SEND_CONTACT_REQUEST, {
            onCompleted: () => {
                setIsDialogOpen(false);
                onContactAdded();
            },
        });

    type ContactFormValues = z.infer<typeof contactFormSchema>;

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (values: ContactFormValues) => {
        try {
            await sendContactRequest({
                variables: {
                    contactToCreate: {
                        targetUserEmail: values.email,
                    },
                },
            });
            form.reset();
        } catch (err) {
            console.error('Error sending contact request:', err);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="">
                    <UserPlus className="mr-2 h-5 w-5" />
<<<<<<< HEAD
                    Ajouter des contacts
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Ajouter un contact</DialogTitle>
                <DialogDescription>
                    Vous pouvez ajouter un contact en entrant son adresse
                    e-mail.
=======
                    {t('contact.add.button')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{t('contact.add.title')}</DialogTitle>
                <DialogDescription>
                    {t('contact.add.description')}
>>>>>>> origin/dev
                </DialogDescription>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2 flex flex-col gap-1.5">
<<<<<<< HEAD
                            <Label htmlFor="email">Adresse e-mail</Label>
=======
                            <Label htmlFor="email">{t('contact.add.form.email.label')}</Label>
>>>>>>> origin/dev
                            <Input
                                id="email"
                                {...form.register('email')}
                                type="email"
<<<<<<< HEAD
                                placeholder="exemple@email.com"
=======
                                placeholder={t('contact.add.form.email.placeholder')}
>>>>>>> origin/dev
                            />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        {sendError && (
                            <p className="text-red-500 text-sm">
                                {sendError.message}
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    form.reset();
                                }}
                            >
<<<<<<< HEAD
                                Annuler
=======
                                {t('contact.add.actions.cancel')}
>>>>>>> origin/dev
                            </Button>
                            <Button type="submit" disabled={sendingRequest}>
                                {sendingRequest ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
<<<<<<< HEAD
                                        Envoi...
                                    </>
                                ) : (
                                    'Ajouter'
=======
                                        {t('contact.add.actions.sending')}
                                    </>
                                ) : (
                                    t('contact.add.actions.add')
>>>>>>> origin/dev
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddContactDialog;
