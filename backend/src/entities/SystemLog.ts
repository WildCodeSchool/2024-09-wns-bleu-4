import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum LogType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

registerEnumType(LogType, {
    name: 'LogType',
    description: 'System log type enum',
});

@ObjectType()
@Entity()
export class SystemLog extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => LogType)
    @Column({
        type: 'enum',
        enum: LogType,
        default: LogType.INFO,
    })
    type: LogType;

    @Field(() => String)
    @Column({
        type: 'varchar',
        length: 255,
    })
    message: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'text',
        nullable: true,
    })
    details?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    userId?: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
} 