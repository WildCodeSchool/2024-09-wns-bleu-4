import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from '@/entities/Resource';
import { Field, ObjectType } from 'type-graphql';

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
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 320,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 150,
    })
    password: string;

    @CreateDateColumn()
    lastLoggedAt: Date;

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

    @OneToOne(() => User, (user) => user.subscription, { nullable: true })
    subscription: User;

    @CreateDateColumn()
    createdAt: Date;
}
