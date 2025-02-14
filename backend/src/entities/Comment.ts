import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { IsDate, MaxLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.comments)
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
