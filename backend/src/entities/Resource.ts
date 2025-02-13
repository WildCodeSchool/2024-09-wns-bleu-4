import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/entities/User';
import { Like } from './Like';
import { Field, ObjectType } from 'type-graphql';
import { Comment } from './Comment';
import { Report } from './Report';

export enum FileVisibility {
    PRIVATE = 'private',
    PUBLIC = 'public',
}

@ObjectType()
@Entity()
export class Resource extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    user: User;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    name: string;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 100,
    })
    path: string;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    url: string;

    @Column({
        type: 'enum',
        enum: FileVisibility,
        default: FileVisibility.PRIVATE,
    })
    visibility: FileVisibility;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 320,
        nullable: true
    })
    description: string;

    @ManyToMany(() => User, (User) => User.resourceAccess)
    usersWithAccess: User[];

    @OneToMany(() => Like, (like) => like.resource)
    likes: Like[]

    @OneToMany(() => Comment, (comment) => comment.resource)
    comments: Comment[]

    @OneToMany(() => Report, (report) => report.resource)
    reports: Report[]
    
    @Column('date', { nullable: true })
    expireAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
