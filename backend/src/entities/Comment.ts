import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";
import { Resource } from "@/entities/Resource";
import { Field } from "type-graphql";

@Entity() 
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.comments)
    resource: Resource;

    @Field(() => String)
    @Column(
        { type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
