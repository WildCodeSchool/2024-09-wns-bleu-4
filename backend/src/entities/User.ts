import { Comment } from '@/entities/Comment';
import { Like } from '@/entities/Like';
import { Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { Subscription } from '@/entities/Subscription';
import { IsDate, IsEnum, Length } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'User role enum',
});

@Entity()
export class TempUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    randomCode: string;
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    email: string;

    @Length(5, 150, {
        message: 'Password must be between 5 and 150 caracters.',
    })
    @Column({
        type: 'varchar',
        length: 150,
    })
    password: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    profilePicture: string | null;

    @IsDate()
    @CreateDateColumn()
    lastLoggedAt: Date;

    @Field(() => UserRole)
    @IsEnum(UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @ManyToMany(() => Resource, (Resource) => Resource.usersWithAccess, {
        nullable: true,
    })
    sharedResources: Resource[];

    @Field(() => Subscription, { nullable: true })
    @OneToOne(() => Subscription, (subscription) => subscription.user, {
        nullable: true,
        eager: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    subscription: Subscription | null;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    stripeCustomerId: string | null;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
