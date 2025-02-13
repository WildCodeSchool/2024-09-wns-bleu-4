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

export enum FileVisibility {
    PRIVATE = 'private',
    PUBLIC = 'public',
}

@Entity()
export class Resource extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    user: User;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    path: string;

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

    @Column({
        type: 'varchar',
        length: 320,
        nullable: true
    })
    description: string;

    @ManyToMany(() => User, (User) => User.resourceAccess)
    usersWithAccess: User[];

    @OneToMany(() => Like, (like) => like.resource)
    likes: Like

    @Column('date', { nullable: true })
    expireAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
