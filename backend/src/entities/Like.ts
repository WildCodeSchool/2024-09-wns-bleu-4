import { BaseEntity, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Resource } from '@/entities/Resource';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => User)
    @ManyToMany(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.likes)
    resource: Resource;
}
