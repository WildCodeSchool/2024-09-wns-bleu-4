import { Contact } from '@/entities/Contact';
import { User } from '@/entities/User';
import {
    Arg,
    Field,
    ID,
    InputType,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class ContactInput implements Partial<Contact> {
    @Field(() => ID)
    sourceUser: User;

    @Field(() => ID)
    targetUser: User;
}

@Resolver(Contact)
class ContactResolver {
    @Query(() => [Contact])
    async getAllContactsFromUser(
        @Arg("userId", () => ID) id: Contact['sourceUser']['id'],
    ): Promise<Contact[]> {
            const contacts = await Contact.find({ where: { sourceUser: { id: id } } });
            return contacts
    }

    @Mutation(() => Contact)
    async createContact(
        @Arg('contactToCreate', () => ContactInput)
        contactToCreate: ContactInput,
    ): Promise<Contact> {
        const newContact = Contact.create({ ...contactToCreate });
        return await Contact.save(newContact);
    }
}

export default ContactResolver;
