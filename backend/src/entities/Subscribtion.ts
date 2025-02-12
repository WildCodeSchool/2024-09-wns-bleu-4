import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscribtion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidAt: Date;

  @Column()
  endAt: Date;
}
