import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { IsDate } from 'class-validator';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    PAST_DUE = 'past_due',
    UNPAID = 'unpaid',
}

@ObjectType()
@Entity()
export class Subscription extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @IsDate()
    @Field(() => Date)
    @Column('timestamp')
    paidAt: Date;

    @IsDate()
    @Field(() => Date)
    @Column('timestamp')
    endAt: Date;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    stripeSubscriptionId: string | null;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    stripePriceId: string | null;

    @Field(() => String)
    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.ACTIVE,
    })
    status: SubscriptionStatus;

    @OneToOne(() => User, { nullable: true })
    user: User;
}
