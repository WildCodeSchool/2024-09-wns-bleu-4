import { DataSource } from 'typeorm';
import { Comment } from '@/entities/Comment';
import { Contact } from '@/entities/Contact';
import { Like } from '@/entities/Like';
import { Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { Subscribtion } from '@/entities/Subscribtion';
import { User } from '@/entities/User';

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    username: 'postgres',
    database: 'postgres',
    password: 'feur',
    entities: [Comment, Contact, Like, Report, Resource, Subscribtion, User],
    synchronize: true,
    logging: ['error', 'query'],
});
