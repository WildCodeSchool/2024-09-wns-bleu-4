import { Like } from '@/entities/Like';
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
export class LikeInput implements Partial<Like> {
    @Field(() => ID)
    user: User;

    @Field(() => ID)
    resource: Resource;
}

// Exemple pour fetch les entités lié à Like
@Resolver(Like)
class LikeResolver {
    @Query(() => [Like])
    async getLikesByUser(@Arg('id', () => ID) id: User['id']): Promise<Like[]> {
        const likes = await Like.find({
            where: { user: { id: id } },
            relations: ['user', 'resource'],
        });
        return likes;
    }

    @Query(() => [Like])
    async getLikesByResource(
        @Arg('id', () => ID) id: Resource['id'],
    ): Promise<Like[]> {
        const likes = await Like.find({
            where: { resource: { id: id } },
            relations: ['user', 'resource'],
        });
        return likes;
    }

    @Mutation(() => Like)
    async createLike(@Arg('data', () => LikeInput) data: Like): Promise<Like> {
        const like = Like.create(data);
        await like.save();
        return like;
    }

    @Mutation(() => String)
    async deleteLike(
        @Arg('likeToDelete', () => LikeInput) likeToDelete: LikeInput,
    ): Promise<string> {
        await Like.delete(likeToDelete);
        return 'Like deleted';
    }
}

export default LikeResolver;
