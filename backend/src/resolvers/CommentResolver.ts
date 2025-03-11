import { Comment } from '@/entities/Comment';
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
export class CommentInput implements Partial<Comment> {
    @Field(() => ID)
    user: User;

    @Field(() => ID)
    resource: Resource;

    @Field(() => String)
    content?: string | undefined;
}

@Resolver(Comment)
class CommentResolver {
    @Query(() => [Comment])
    async getCommentsByUser(
        @Arg('id', () => ID) id: User['id'],
    ): Promise<Comment[]> {
        const comments = await Comment.find({
            where: { user: { id: id } },
            relations: ['user', 'resource'],
        });
        return comments;
    }

    @Query(() => [Comment])
    async getCommentsByResource(
        @Arg('id', () => ID) id: Resource['id'],
    ): Promise<Comment[]> {
        const comments = await Comment.find({
            where: { resource: { id: id } },
            relations: ['user', 'resource'],
        });
        return comments;
    }

    @Mutation(() => Comment)
    async createComment(
        @Arg('newComment', () => CommentInput) newComment: Comment,
    ): Promise<Comment> {
        const comment = Comment.create(newComment);
        await comment.save();
        return comment;
    }

    @Mutation(() => String)
    async deleteComment(
        @Arg('commentToDelete', () => CommentInput)
        commentToDelete: CommentInput,
    ): Promise<string> {
        await Comment.delete(commentToDelete);
        return 'Commentaire supprimé';
    }
}

export default CommentResolver;
