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

@ObjectType()
@Entity()
export class Subscribtion extends BaseEntity {
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

    @OneToOne(() => User, { nullable: true })
    user: User;
}
