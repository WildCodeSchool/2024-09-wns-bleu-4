import { faker } from '@faker-js/faker';
import { User, UserRole } from '../entities/User';
import * as argon2 from 'argon2';

const generateSecurePassword = () => {
    const length = faker.number.int({ min: 12, max: 16 });
    const uppercase = faker.string.alpha({ length: 1, casing: 'upper' });
    const lowercase = faker.string.alpha({ length: length - 4, casing: 'lower' });
    const numbers = faker.string.numeric(2);
    const special = faker.helpers.arrayElement(['!', '@', '#', '$', '%', '&', '*', '-', '_', '+', '=']);

    return (uppercase + lowercase + numbers + special)
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
};

export const seedUsers = async () => {
    console.log('👤 Seeding users...');

    // Vérifier s’il existe au moins un admin
    const adminCount = await User.count({ where: { role: UserRole.ADMIN } });

    if (adminCount === 0) {
        const adminPassword = await argon2.hash('Admin@123456');
        const admin = User.create({
            email: 'admin@example.com',
            password: adminPassword,
            role: UserRole.ADMIN,
            lastLoggedAt: new Date(),
            createdAt: new Date(),
        });
        await admin.save();
        console.log('✅ Admin user created');
    } else {
        console.log(`ℹ️ Admin(s) already exist: ${adminCount}`);
    }

    // Vérifier combien d'utilisateurs USER il y a
    const userCount = await User.count({ where: { role: UserRole.USER } });
    const usersToCreate = 10 - userCount;

    if (usersToCreate > 0) {
        console.log(`ℹ️ Found ${userCount} users. Creating ${usersToCreate} more...`);
        const users = [];

        for (let i = 0; i < usersToCreate; i++) {
            const email = faker.internet.email();
            const password = await argon2.hash(generateSecurePassword());

            const user = User.create({
                email,
                password,
                role: UserRole.USER,
                lastLoggedAt: faker.date.past(),
                createdAt: faker.date.past(),
            });

            users.push(user);
        }

        await User.save(users);
        console.log(`✅ Created ${users.length} new user(s)`);
    } else {
        console.log(`ℹ️ Already have ${userCount} users. No need to add more.`);
    }

    console.log('✅ Seeding completed');
};
