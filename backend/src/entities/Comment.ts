import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";
import { Resource } from "@/entities/Resource";
import { Field, ID } from "type-graphql";
import { IsDate, MaxLength } from "class-validator";

@Entity() 
export class Comment extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.comments)
    resource: Resource;

    @Field(() => String)
    @MaxLength(500, { message: "The content length can't exceed 500 caracters." })
    @Column({ type: 'text' })
    content: string;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
