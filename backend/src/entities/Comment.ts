import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";
import { Resource } from "@/entities/Resource";

@Entity() 
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    user: User;

    @ManyToOne(() => Resource)
    resource: Resource;

    @Column(
        { type: "longtext" })
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
