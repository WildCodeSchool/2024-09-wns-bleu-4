import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { Arg, Field, ID, InputType, Mutation, Resolver } from 'type-graphql';

@InputType()
export class ResourceInput implements Partial<ResourceInput> {
    @Field(() => ID)
    userId: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;

    @Field(() => String)
    url: string;

    @Field(() => String)
    path: string;
}

@Resolver(Resource)
class ResourceResolver {
    @Mutation(() => Resource)
    async createResource(
        @Arg('data', () => ResourceInput) data: ResourceInput,
    ): Promise<Resource> {
        const user = await User.findOneBy({ id: data.userId });
        if (!user) {
            throw new Error('User not found');
        }

        const resource = Resource.create({ ...data, user });

        // Log the resource data for debugging
        console.log('Creating resource with data:', resource);

        // Ensure the resource is saved correctly
        await resource.save();
        return resource;
    }
}

export default ResourceResolver;
