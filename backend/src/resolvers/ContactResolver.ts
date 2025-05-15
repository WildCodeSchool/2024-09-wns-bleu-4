import { Contact, ContactStatus } from '@/entities/Contact';
import { User } from '@/entities/User';
import {
    Arg,
    Field,
    ID,
    InputType,
    Mutation,
    Query,
    Resolver,
    Ctx,
} from 'type-graphql';

@InputType()
export class ContactInput {
    @Field(() => String)
    targetUserEmail: string;
}

@Resolver(Contact)
class ContactResolver {
    @Query(() => [Contact])
    async getMyContacts(@Ctx() context: any): Promise<Contact[]> {
        if (!context.email) {
            throw new Error("Vous devez être connecté pour voir vos contacts");
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const contacts = await Contact.find({ 
            where: { sourceUser: { id: user.id } },
            relations: ["sourceUser", "targetUser"]
        });
        return contacts;
    }

    @Query(() => [Contact])
    async getPendingContactRequests(@Ctx() context: any): Promise<Contact[]> {
        if (!context.email) {
            throw new Error("Vous devez être connecté pour voir vos demandes de contact");
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const contacts = await Contact.find({ 
            where: { 
                targetUser: { id: user.id },
                status: ContactStatus.PENDING
            },
            relations: ["sourceUser", "targetUser"]
        });
        return contacts;
    }

    @Mutation(() => Contact)
    async sendContactRequest(
        @Arg('contactToCreate', () => ContactInput) contactToCreate: ContactInput,
        @Ctx() context: any
    ): Promise<Contact> {
        if (!context.email) {
            throw new Error("Vous devez être connecté pour envoyer une demande de contact");
        }

        const sourceUser = await User.findOne({ where: { email: context.email } });
        if (!sourceUser) {
            throw new Error("Utilisateur source non trouvé");
        }

        const targetUser = await User.findOne({ where: { email: contactToCreate.targetUserEmail } });
        if (!targetUser) {
            throw new Error("Utilisateur cible non trouvé");
        }

        const existingContact = await Contact.findOne({
            where: {
                sourceUser: { id: sourceUser.id },
                targetUser: { id: targetUser.id }
            }
        });

        if (existingContact) {
            throw new Error("Ce contact existe déjà");
        }

        const newContact = Contact.create({ 
            sourceUser: sourceUser,
            targetUser: targetUser,
            status: ContactStatus.PENDING
        });
        
        return await Contact.save(newContact);
    }

    @Mutation(() => Contact)
    async acceptContactRequest(
        @Arg("contactId", () => ID) contactId: number,
        @Ctx() context: any
    ): Promise<Contact> {
        if (!context.email) {
            throw new Error("Vous devez être connecté pour accepter une demande de contact");
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                targetUser: { id: user.id },
                status: ContactStatus.PENDING
            }
        });

        if (!contact) {
            throw new Error("Demande de contact non trouvée");
        }

        contact.status = ContactStatus.ACCEPTED;
        return await Contact.save(contact);
    }

    @Mutation(() => Contact)
async refuseContactRequest(
    @Arg("contactId", () => ID) contactId: number,
    @Ctx() context: any
): Promise<Contact> {
    if (!context.email) {
        throw new Error("Vous devez être connecté pour refuser une demande de contact");
    }

    const user = await User.findOne({ where: { email: context.email } });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }

    const contact = await Contact.findOne({
        where: {
            id: contactId,
            targetUser: { id: user.id },
            status: ContactStatus.PENDING
        }
    });

    if (!contact) {
        throw new Error("Demande de contact non trouvée");
    }

    contact.status = ContactStatus.REFUSED;
    return await Contact.save(contact);
}


    @Mutation(() => Boolean)
    async removeContact(
        @Arg("contactId", () => ID) contactId: number,
        @Ctx() context: any
    ): Promise<boolean> {
        if (!context.email) {
            throw new Error("Vous devez être connecté pour supprimer un contact");
        }

        const user = await User.findOne({ where: { email: context.email } });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                sourceUser: { id: user.id }
            }
        });

        if (!contact) {
            throw new Error("Contact non trouvé");
        }

        await Contact.remove(contact);
        return true;
    }
}

export default ContactResolver;
