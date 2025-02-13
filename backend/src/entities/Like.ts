import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Resource } from '@/entities/Resource';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => ID)
    @ManyToOne(() => User)
    user: User;

    @Field(() => ID)
    @ManyToOne(() => Resource, (resource) => resource.likes)
    resource: Resource;
}
