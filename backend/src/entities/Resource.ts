import { User } from '@/entities/User';
import { Field, ObjectType } from 'type-graphql';
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
import { Comment } from './Comment';
import { Like } from './Like';
import { Report } from './Report';
import { IsDate, IsEnum, Length, MaxLength } from 'class-validator';

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
    @MaxLength(150, { message: "The file name can't exceed 150 caracters."})
    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    name: string;

    @Field(() => String)
    @MaxLength(100, { message: "The path name can't exceed 100 caracters."})
    @Column({
        type: 'varchar',
        length: 100,
    })
    path: string;

    @Field(() => String)
    @MaxLength(150, { message: "The url length can't exceed 255 caracters."})
    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    url: string;

    @IsEnum(FileVisibility)
    @Column({
        type: 'enum',
        enum: FileVisibility,
        default: FileVisibility.PRIVATE,
    })
    visibility: FileVisibility;

    @Field(() => String)
    @Length(30, 320, { message: "File description length must be between 30 and 320 caracters."})
    @Column({
        type: 'varchar',
        length: 320,
        nullable: true,
    })
    description: string;

    @Field(() => [User])
    @ManyToMany(() => User, (User) => User.resourceAccess)
    usersWithAccess: User[];

    @Field(() => [Like])
    @OneToMany(() => Like, (like) => like.resource, { nullable: true })
    likes: Like[];

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.resource, { nullable: true })
    comments: Comment[];

    @Field(() => [Report])
    @OneToMany(() => Report, (report) => report.resource)
    reports: Report[];

    @IsDate()
    @Column('date', { nullable: true })
    expireAt: Date;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
