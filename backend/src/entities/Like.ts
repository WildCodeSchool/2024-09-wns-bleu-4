import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['user', 'resource'])
export class Like extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => User, { nullable: false })
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Field(() => Resource, { nullable: false })
    @ManyToOne(() => Resource, (resource) => resource.likes, {
        onDelete: 'CASCADE',
    })
    resource: Resource;
}
