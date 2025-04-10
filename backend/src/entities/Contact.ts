import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";
import { User } from "@/entities/User";
import { registerEnumType, Field, ID, ObjectType } from "type-graphql";
import { IsDate } from "class-validator";

export enum ContactStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REFUSED = 'refused'
}

registerEnumType(ContactStatus, {
  name: 'ContactStatus',
  description: 'Le statut d\'un contact : en attente, accepté ou refusé',
});

@ObjectType()
@Entity()
export class Contact extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @ManyToOne(() => User)
  sourceUser: User;

  @Field(() => ID)
  @ManyToOne(() => User)
  targetUser: User;

  @Field(() => ContactStatus)
  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING
  })
  status: ContactStatus;

  @Field(() => Date)
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;
}
