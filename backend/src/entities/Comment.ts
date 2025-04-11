import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { IsDate, MaxLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.comments)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.comments, {
        onDelete: 'CASCADE',
    })
    @Field(() => Resource)
    resource: Resource;

    @Field(() => String)
    @MaxLength(500, {
        message: "The content length can't exceed 500 caracters.",
    })
    @Column({ type: 'text' })
    content: string;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
