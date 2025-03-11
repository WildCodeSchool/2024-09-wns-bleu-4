import { Comment } from '@/entities/Comment';
import { Resource } from '@/entities/Resource';
import { Subscription } from '@/entities/Subscription';
import { IsDate, IsEmail, IsEnum, Length } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
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

@Entity()
export class TempUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    generatedCode: string;
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @IsEmail()
    @Length(5, 150, { message: 'Email must be between 5 and 150 caracters.' })
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

    @IsDate()
    @CreateDateColumn()
    lastLoggedAt: Date;

    @IsEnum(UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @ManyToMany(() => Resource, (Resource) => Resource.usersWithAccess, {
        nullable: true,
    })
    resourceAccess: Resource[];

    @Field(() => Subscription, { nullable: true })
    @OneToOne(() => Subscription, (subscription) => subscription.user, {
        nullable: true,
        eager: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    subscription: Subscription | null;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
