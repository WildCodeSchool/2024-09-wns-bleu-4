import { BaseEntity, Column, Entity } from "typeorm";
import { User } from "./User";
import { File } from "./File";

@Entity() 
export class Comment extends BaseEntity {

@Column()
id: number;

@Column()
user: any;

@Column()
file: any;

}