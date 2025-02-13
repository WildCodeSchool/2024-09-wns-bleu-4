import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Subscribtion extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Date)
    @Column('timestamp')
    paidAt: Date;

    @Field(() => Date)
    @Column('timestamp')
    endAt: Date;

    @OneToOne(() => User, { nullable: true })
    user: User;
}
