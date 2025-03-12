import { DataSource } from 'typeorm';
import { Comment } from '@/entities/Comment';
import { Contact } from '@/entities/Contact';
import { Like } from '@/entities/Like';
import { Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { Subscription } from '@/entities/Subscription';
import { TempUser, User } from '@/entities/User';

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    username: 'postgres',
    database: 'postgres',
    password: 'example',
    entities: [Comment, Contact, Like, Report, Resource, Subscription, User, TempUser],
    synchronize: true,
    logging: ['error', 'query'],
});
