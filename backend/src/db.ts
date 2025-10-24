import { DataSource } from 'typeorm';
import { Contact } from '@/entities/Contact';
import { Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { Subscription } from '@/entities/Subscription';
import { SystemLog } from '@/entities/SystemLog';
import { TempUser, User } from '@/entities/User';

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    username: 'postgres',
    database: 'postgres',
    password: 'example',
    entities: [Contact, Report, Resource, Subscription, SystemLog, User, TempUser],
    synchronize: true,
    logging: ['error', 'query'],
});
