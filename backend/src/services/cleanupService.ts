import { Resource } from '@/entities/Resource';
import { LogType } from '@/entities/SystemLog';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import fs from 'fs';
import path from 'path';
import { LessThan } from 'typeorm';

/**
 * Clean up expired resources from database and file system
 */
export const cleanupExpiredResources = async (): Promise<void> => {
    try {
        const now = new Date();

        const expiredResources = await Resource.find({
            where: {
                expireAt: LessThan(now),
            },
            relations: ['user'],
        });

        if (expiredResources.length === 0) {
            console.log('No expired resources to clean up');
            return;
        }

        console.log(
            `Found ${expiredResources.length} expired resources to clean up`,
        );

        for (const resource of expiredResources) {
            try {
                const uploadsDir = path.join(
                    process.cwd(),
                    '..',
                    'storage-api',
                    'uploads',
                );
                const filePath = path.join(uploadsDir, resource.url);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(
                        `Deleted expired file: ${resource.name} (${resource.id})`,
                    );
                } else {
                    console.log(
                        `File not found on disk: ${resource.name} (${resource.id})`,
                    );
                }

                await Resource.remove(resource);

                await SystemLogResolver.logEvent(
                    LogType.SUCCESS,
                    'Fichier expiré supprimé',
                    `Le fichier "${resource.name}" a été automatiquement supprimé après expiration`,
                    resource.user.email,
                );
            } catch (error) {
                console.error(
                    `Error cleaning up resource ${resource.id}:`,
                    error,
                );

                await SystemLogResolver.logEvent(
                    LogType.ERROR,
                    'Erreur lors du nettoyage automatique',
                    `Erreur lors de la suppression du fichier expiré "${resource.name}" (ID: ${resource.id}): ${error}`,
                    resource.user.email,
                );
            }
        }

        console.log(
            `Cleanup completed. Processed ${expiredResources.length} expired resources.`,
        );
    } catch (error) {
        console.error('Error during cleanup process:', error);

        await SystemLogResolver.logEvent(
            LogType.ERROR,
            'Erreur du service de nettoyage',
            `Erreur générale lors du nettoyage automatique: ${error}`,
            undefined,
        );
    }
};
