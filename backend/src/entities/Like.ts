import { BaseEntity, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Resource } from '@/entities/Resource';

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    user: User;

    @OneToOne(() => Resource)
    resource: Resource;
}
