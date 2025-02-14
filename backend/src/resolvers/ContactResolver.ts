import { Contact } from "@/entities/Contact";
import { User } from "@/entities/User";
import {
    Arg,
    Field,
    ID,
    InputType,
    Query,
    Resolver,
  } from "type-graphql";
  
  @InputType()
  export class ContactInput implements Partial<Contact> {
    @Field(() => ID)
    sourceUser: User;
  
    @Field(() => ID)
    targetUser: User;
  }
  
  @Resolver(Contact)
  class ContactResolver {
    
    @Query(() => [User])
    async getAllContactsFromUser(@Arg("sourceUser", () => ContactInput) sourceUser: User): Promise<Contact[]> {
        const contacts = await Contact.findBy({ sourceUser: sourceUser })
        return contacts
    }
  
  }
  
  export default ContactResolver;
  