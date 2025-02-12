import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sourceUser: User;

  @ManyToOne(() => User)
  targetUser: User;

}
