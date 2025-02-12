import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => User, user => user.subscription)
    subscription: User;

  @Column()
  createdAt: Date;
}