import { BaseEntity, Column, Entity } from "typeorm";
import { User } from "./User";
import { File } from "./File";
export enum Reason {
    INNAPROPRIATE = "inappropriate content",
    HARASSMENT ="harassment",
    SPAM = "spam",
    OTHER ="other",
    NONE = "none"
}

@Entity() 
export class Comment extends BaseEntity {

@Column()
id: number;

@Column()
user: any;

@Column()
file: any;

@Column(
    { type: "longtext" })
content: string;

@Column(
    { type: "enum",
    enum: Reason,
    default: Reason.NONE
     })
reason: Reason;

@Column(
    createdAt: Date,
)
}
