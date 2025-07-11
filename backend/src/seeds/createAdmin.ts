import { dataSource } from '../db';
import { User, UserRole } from '../entities/User';
import * as argon2 from 'argon2';

const createNewAdmin = async () => {
    try {
        await dataSource.initialize();
        console.log('🌱 Creating new admin user...');

        // Supprimer l'ancien admin s'il existe
        const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
        if (existingAdmin) {
            await existingAdmin.remove();
            console.log('🗑️ Removed existing admin user');
        }

        // Créer un nouvel admin
        const adminPassword = await argon2.hash('Admin@123456');
        const newAdmin = User.create({
            email: 'admin@example.com',
            password: adminPassword,
            role: UserRole.ADMIN,
            lastLoggedAt: new Date(),
            createdAt: new Date(),
        });

        await newAdmin.save();
        console.log('✅ New admin user created successfully');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Password: Admin@123456');
        console.log('👑 Role: ADMIN');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createNewAdmin(); 