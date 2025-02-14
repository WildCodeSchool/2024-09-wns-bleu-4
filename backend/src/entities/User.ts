import { Resource } from '@/entities/Resource';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscribtion } from './Subscribtion';
import { IsDate, IsEmail, IsEnum, Length } from 'class-validator';

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
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Field(() => String)
    @IsEmail()
    @Length(5, 150, { message: "Email must be between 5 and 150 caracters."})
    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    email: string;

    @Length(5, 150, { message: "Password must be between 5 and 150 caracters."})
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

    @ManyToMany(() => Resource, (Resource) => Resource.usersWithAccess, {
        nullable: true,
    })
    resourceAccess: Resource[];

    @Field(() => Subscribtion, { nullable: true })
    @OneToOne(() => Subscribtion, (subscription) => subscription.user, {
        nullable: true,
        eager: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    subscription: Subscribtion | null;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
