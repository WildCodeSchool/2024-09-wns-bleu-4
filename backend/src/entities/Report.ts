import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Resource } from '@/entities/Resource';

export enum Reason {
    INNAPROPRIATE = 'inappropriate content',
    HARASSMENT = 'harassment',
    SPAM = 'spam',
    OTHER = 'other',
    NONE = 'none',
}

@Entity()
export class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => User)
    user: User;

    @Column(() => Resource)
    resource: Resource;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'enum', enum: Reason, default: Reason.NONE })
    reason: Reason;

    @CreateDateColumn()
    createdAt: Date;
}
