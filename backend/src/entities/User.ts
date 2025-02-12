import { BaseEntity, Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Resource } from "@/entities/Resource";

export enum UserRole {
    USER = "user", ADMIN = "admin",
}

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 320,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  password: string;

  @Column()
  lastLoggedAt: Date;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToMany(() => Resource, (Resource) => Resource.usersWithAccess)
  resourceAccess: Resource[]

  @OneToOne(() => User, user => user.subscription, { nullable: true })
  subscription: User;

  @Column()
  createdAt: Date;
}