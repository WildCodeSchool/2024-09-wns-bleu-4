import { BaseEntity, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/entities/User";

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  sourceUser: User;

  @ManyToMany(() => User)
  targetUser: User;

}
