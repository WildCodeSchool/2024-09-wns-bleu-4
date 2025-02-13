import { Like } from '@/entities/Like';
import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from 'type-graphql';

@InputType()
export class LikeInput implements Partial<Like> {
    @Field(() => ID)
    user: User;

    @Field(() => ID)
    resource: Resource;
}

@Resolver(Like)
class LikeResolver {
    @Query(() => [Like])
    async getLikesByUser(@Arg("id", () => ID) id: number): Promise<Like[]> {
        const likes = await Like.find({ where: { user: { id: id } } });
        return likes;
    }

    @Mutation(() => Like)
    async createLike(@Arg("data", () => LikeInput) data: Like): Promise<Like> {
        const like = Like.create(data);
        await like.save();
        return like;
    }

    @Mutation(() => String)
    async deleteLike(@Arg("id", () => LikeInput) id: LikeInput): Promise<string> {
        await Like.delete(id);
        return 'Like deleted';
    }
}

export default LikeResolver;
