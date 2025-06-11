import { Contact, ContactStatus } from '@/entities/Contact';
import { User } from '@/entities/User';
import {
    Arg,
    Ctx,
    Field,
    ID,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class ContactInput {
    @Field(() => String)
    targetUserEmail: string;
}

@ObjectType()
export class ContactsResponse {
    @Field(() => [Contact])
    acceptedContacts: Contact[];

    @Field(() => [Contact])
    pendingRequestsReceived: Contact[];

    @Field(() => [Contact])
    pendingRequestsSent: Contact[];
}

@Resolver(Contact)
class ContactResolver {
    @Query(() => ContactsResponse)
    async getMyContacts(@Ctx() context: any): Promise<ContactsResponse> {
        if (!context.email) {
            throw new Error('Vous devez être connecté pour voir vos contacts');
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const allContacts = await Contact.find({
            where: [
                { sourceUser: { id: user.id } },
                { targetUser: { id: user.id } },
            ],
            relations: ['sourceUser', 'targetUser'],
            order: { createdAt: 'DESC' },
        });

        const acceptedContacts = allContacts.filter(
            (contact) => contact.status === ContactStatus.ACCEPTED,
        );

        const pendingRequestsReceived = allContacts.filter(
            (contact) =>
                contact.status === ContactStatus.PENDING &&
                contact.targetUser.id === user.id,
        );

        const pendingRequestsSent = allContacts.filter(
            (contact) =>
                contact.status === ContactStatus.PENDING &&
                contact.sourceUser.id === user.id,
        );

        return {
            acceptedContacts,
            pendingRequestsReceived,
            pendingRequestsSent,
        };
    }

    @Mutation(() => Contact)
    async sendContactRequest(
        @Arg('contactToCreate', () => ContactInput)
        contactToCreate: ContactInput,
        @Ctx() context: any,
    ): Promise<Contact> {
        if (!context.email) {
            throw new Error(
                'Vous devez être connecté pour envoyer une demande de contact',
            );
        }

        const sourceUser = await User.findOne({
            where: { email: context.email },
        });
        if (!sourceUser) {
            throw new Error('Utilisateur source non trouvé');
        }

        const targetUser = await User.findOne({
            where: { email: contactToCreate.targetUserEmail },
        });
        if (!targetUser) {
            throw new Error('Utilisateur cible non trouvé');
        }

        if (sourceUser.id === targetUser.id) {
            throw new Error(
                'Vous ne pouvez pas vous ajouter vous-même en contact',
            );
        }

        const existingContact = await Contact.findOne({
            where: [
                {
                    sourceUser: { id: sourceUser.id },
                    targetUser: { id: targetUser.id },
                },
                {
                    sourceUser: { id: targetUser.id },
                    targetUser: { id: sourceUser.id },
                },
            ],
            relations: ['sourceUser', 'targetUser'],
        });

        if (existingContact) {
            if (existingContact.sourceUser.id === sourceUser.id) {
                throw new Error(
                    'Vous avez déjà envoyé une demande à cet utilisateur',
                );
            } else {
                throw new Error(
                    'Cet utilisateur vous a déjà envoyé une demande de contact. Veuillez vérifier vos demandes reçues.',
                );
            }
        }

        const newContact = Contact.create({
            sourceUser: sourceUser,
            targetUser: targetUser,
            status: ContactStatus.PENDING,
        });

        return await Contact.save(newContact);
    }

    @Mutation(() => Contact)
    async acceptContactRequest(
        @Arg('contactId', () => ID) contactId: number,
        @Ctx() context: any,
    ): Promise<Contact> {
        if (!context.email) {
            throw new Error(
                'Vous devez être connecté pour accepter une demande de contact',
            );
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                targetUser: { id: user.id },
                status: ContactStatus.PENDING,
            },
        });

        if (!contact) {
            throw new Error('Demande de contact non trouvée');
        }

        contact.status = ContactStatus.ACCEPTED;
        return await Contact.save(contact);
    }

    @Mutation(() => Contact)
    async refuseContactRequest(
        @Arg('contactId', () => ID) contactId: number,
        @Ctx() context: any,
    ): Promise<Contact> {
        if (!context.email) {
            throw new Error(
                'Vous devez être connecté pour refuser une demande de contact',
            );
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                targetUser: { id: user.id },
                status: ContactStatus.PENDING,
            },
        });

        if (!contact) {
            throw new Error('Demande de contact non trouvée');
        }

        contact.status = ContactStatus.REFUSED;
        return await Contact.save(contact);
    }

    @Mutation(() => Boolean)
    async removeContact(
        @Arg('contactId', () => ID) contactId: number,
        @Ctx() context: any,
    ): Promise<boolean> {
        if (!context.email) {
            throw new Error(
                'Vous devez être connecté pour supprimer un contact',
            );
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const contact = await Contact.findOne({
            where: [
                {
                    id: contactId,
                    sourceUser: { id: user.id },
                },
                {
                    id: contactId,
                    targetUser: { id: user.id },
                },
            ],
        });

        if (!contact) {
            throw new Error('Contact non trouvé');
        }

        await Contact.remove(contact);
        return true;
    }
}

export default ContactResolver;
