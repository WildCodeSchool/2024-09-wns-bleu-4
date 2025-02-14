import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Resource } from '@/entities/Resource';
import { Field, ID, ObjectType } from 'type-graphql';
import { IsDate, IsEnum } from 'class-validator';

export enum Reason {
    INNAPROPRIATE = 'inappropriate content',
    HARASSMENT = 'harassment',
    SPAM = 'spam',
    OTHER = 'other',
    NONE = 'none',
}

@ObjectType()
@Entity()
export class Report extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Resource, (resource) => resource.reports)
    resource: Resource;

    @Field(() => String)
    @Column({ type: 'text', nullable: true })
    content: string;

    @Field(() => Reason)
    @IsEnum(Reason)
    @Column({ type: 'enum', enum: Reason, default: Reason.NONE })
    reason: Reason;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;
}
