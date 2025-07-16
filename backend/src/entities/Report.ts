import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { IsDate, IsEnum } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum Reason {
    CORRUPTED = 'corrupted',
    DISPLAY = 'display',
    INNAPROPRIATE = 'inappropriate',
    HARASSMENT = 'harassment',
    SPAM = 'spam',
    OTHER = 'other',
    NONE = 'none',
}

registerEnumType(Reason, {
    name: 'Reason',
    description: 'The reasons for reporting a resource',
});

@ObjectType()
@Entity()
export class Report extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Field(() => Resource)
    @ManyToOne(() => Resource, (resource) => resource.reports, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    resource: Resource;

    @Field(() => String)
    @Column({ type: 'text', nullable: true })
    content: string;

    @Field(() => Reason)
    @IsEnum(Reason)
    @Column({ type: 'enum', enum: Reason, default: Reason.NONE })
    reason: Reason;

    @Field(() => Date)
    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
