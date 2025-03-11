import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @ManyToOne(() => User)
  sourceUser: User;

  @Field(() => ID)
  @ManyToOne(() => User)
  targetUser: User;
}
