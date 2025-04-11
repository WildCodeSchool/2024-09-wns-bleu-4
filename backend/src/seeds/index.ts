import { dataSource } from '../db';
import { seedUsers } from './user.seed';

const runSeeds = async () => {
    try {
        await dataSource.initialize();
        console.log('🌱 Starting seeding...');

        await seedUsers();

        console.log('✅ Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};

runSeeds(); 