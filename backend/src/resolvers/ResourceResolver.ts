import { Resource } from '@/entities/Resource';
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
export class ResourceInput implements Partial<Resource> {
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
    @Query(() => [Resource])
    async getAllResources(): Promise<Resource[]> {
        return await Resource.find();
    }

    @Query(() => Resource, { nullable: true })
    async getResourceById(
        @Arg('id', () => ID) id: number,
    ): Promise<Resource | null> {
        return await Resource.findOne({ where: { id } });
    }

    @Query(() => [Resource])
    async getResourcesByUserId(
        @Arg('userId', () => ID) userId: number,
    ): Promise<Resource[]> {
        return await Resource.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    @Mutation(() => Resource)
    async createResource(
        @Arg('data', () => ResourceInput) data: ResourceInput,
    ): Promise<Resource> {
        const user = await User.findOne({ where: { id: data.userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const resource = Resource.create({ ...data, user });

        console.log('Creating resource with data:', resource);

        return await Resource.save(resource);
    }

    @Mutation(() => String)
    async deleteResource(@Arg('id', () => ID) id: string): Promise<String> {
        const resource = await Resource.findOne({
            where: { id: parseInt(id) },
            relations: [
                'user',
                'usersWithAccess',
                'likes',
                'comments',
                'reports',
            ],
        });

        if (!resource) {
            throw new Error('Resource not found');
        }

        await Resource.remove(resource);

        return 'Resource deleted';
    }
}

export default ResourceResolver;
