import { Like } from '@/entities/Like';
import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';

@InputType()
export class LikeInput implements Partial<Like> {
    @Field()
    id: number;

    @Field()
    user: User;

    @Field()
    resource: Resource;
}

@Resolver(Like)
class LikeResolver {
    @Query(() => [Like])
    async getLike() {
        const like = await Like.find();
        return like;
    }

    @Query(() => [Like])
    async getLikesByUser(@Arg('userId') userId: number): Promise<Like[]> {
        const likes = await Like.find({ where: { user: { id: userId } } });
        return likes;
    }

    @Mutation(() => Like)
    async createLike(@Arg('data') data: Like): Promise<Like> {
        const like = Like.create(data);
        await like.save();
        return like;
    }

    @Mutation(() => String)
    async deleteLike(@Arg('id') id: LikeInput): Promise<string> {
        await Like.delete(id);
        return 'Like deleted';
    }
}

export default LikeResolver;
