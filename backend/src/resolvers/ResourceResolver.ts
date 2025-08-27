import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import SystemLogResolver from './SystemLogResolver';
import { LogType } from '@/entities/SystemLog';
import {
    Arg,
    Field,
    ID,
    InputType,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class ResourceInput implements Partial<Resource> {
    @Field(() => ID)
    userId: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;

    @Field(() => String)
    url: string;

    @Field(() => String)
    path: string;

    @Field(() => Number, { nullable: false })
    size: number;
}

@Resolver(Resource)
class ResourceResolver {
    @Query(() => [Resource])
    async getAllResources(): Promise<Resource[]> {
        return await Resource.find({ relations: ['user'] });
    }

    @Query(() => Resource, { nullable: true })
    async getResourceById(
        @Arg('id', () => ID) id: number,
    ): Promise<Resource | null> {
        return await Resource.findOne({ where: { id } });
    }

    @Query(() => [Resource])
    async getResourcesByUserId(
        @Arg('userId', () => ID) userId: number,
    ): Promise<Resource[]> {
        return await Resource.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

<<<<<<< HEAD
=======
    @Query(() => Number)
    async getUserTotalFileSize(
        @Arg('userId', () => ID) userId: number,
    ): Promise<number> {
        const result = await Resource.createQueryBuilder('resource')
            .select('SUM(resource.size)', 'totalSize')
            .where('resource.user.id = :userId', { userId })
            .getRawOne();
        
        const totalSize = result?.totalSize ? Number(result.totalSize) : 0;
        
        return totalSize;
    }

>>>>>>> origin/dev
    @Query(() => [User])
    async getUsersWithAccess(
        @Arg('resourceId', () => ID) resourceId: number,
    ): Promise<User[]> {
        const resource = await Resource.findOne({ where: { id: resourceId }, relations: ['usersWithAccess'] });
<<<<<<< HEAD
        return resource?.usersWithAccess ?? [];
=======
        return resource?.usersWithAccess || [];
>>>>>>> origin/dev
    }

    @Mutation(() => String)
    async createUserAccess(
        @Arg('resourceId', () => ID) resourceId: number,
        @Arg('userId', () => ID) userId: number,
    ): Promise<string> {
<<<<<<< HEAD
        
        const resource = await Resource.findOne({ 
            where: { id: resourceId },
            relations: ['usersWithAccess'],
        });

        if (!resource) {
            throw new Error('Le fichier demandé n\'a pas été trouvé');
        };

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('L\'utilisateur demandé n\'a pas été trouvé');
        };

        // Check if user already has access to this resource
        if (resource.usersWithAccess.some(u => u.id === user.id)) {
            return 'User already has access to this resource';
        } else {
            resource.usersWithAccess.push(user);
            await Resource.save(resource);
            return 'Access granted';
        }

=======
        try {
            const resource = await Resource.findOne({ 
                where: { id: resourceId },
                relations: ['usersWithAccess', 'user'],
            });

            if (!resource) {
                throw new Error('Le fichier demandé n\'a pas été trouvé');
            };

            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('L\'utilisateur demandé n\'a pas été trouvé');
            };

            // Check if user already has access to this resource
            if (resource.usersWithAccess.some(u => u.id === user.id)) {
                return 'User already has access to this resource';
            } else {
                resource.usersWithAccess.push(user);
                await Resource.save(resource);

                // Log de l'événement
                await SystemLogResolver.logEvent(
                    LogType.SUCCESS,
                    'Accès fichier accordé',
                    `L'accès au fichier "${resource.name}" a été accordé à l'utilisateur ${user.email}`,
                    resource.user.email
                );

                return 'Access granted';
            }
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de l\'accord d\'accès',
                `Erreur lors de l'accord d'accès au fichier ID ${resourceId}: ${error}`,
                undefined
            );
            throw error;
        }
>>>>>>> origin/dev
    }

    @Mutation(() => Resource)
    async createResource(
        @Arg('data', () => ResourceInput) data: ResourceInput,
    ): Promise<Resource> {
<<<<<<< HEAD
        const user = await User.findOne({ where: { id: data.userId } });
        if (!user) {
            throw new Error('L\'utilisateur demandé n\'a pas été trouvé');
=======
        try {
            const user = await User.findOne({ 
                where: { id: data.userId },
                relations: ['subscription']
            });
            if (!user) {
                throw new Error('L\'utilisateur demandé n\'a pas été trouvé');
            }

            // Only check storage limit for non-subscribed users
            if (!user.subscription) {
                const MAX_STORAGE_BYTES = 20971520; // 20MB = 20 × 1024 × 1024 = 20,971,520 bytes
                
                // Get current user's total file size
                const currentTotalSize = await this.getUserTotalFileSize(data.userId);
                                
                // Check if adding this file would exceed the limit
                if (currentTotalSize + data.size > MAX_STORAGE_BYTES) {
                    throw new Error('Storage limit exceeded. This file would exceed your 20MB storage limit.');
                }
            }

            const resource = Resource.create({ ...data, user, size: data.size });

            const savedResource = await Resource.save(resource);

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Fichier créé',
                `Le fichier "${data.name}" a été créé par l'utilisateur ${user.email}`,
                user.email
            );

            return savedResource;
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la création de fichier',
                `Erreur lors de la création du fichier "${data.name}": ${error}`,
                undefined
            );
            throw error;
>>>>>>> origin/dev
        }
    }

    @Mutation(() => String)
    async deleteResource(@Arg('id', () => ID) id: string): Promise<String> {
        try {
            const resource = await Resource.findOne({
                where: { id: parseInt(id) },
                relations: [
                    'user',
                    'usersWithAccess',
                    'likes',
                    'comments',
                    'reports',
                ],
            });

<<<<<<< HEAD
        if (!resource) {
            throw new Error('Le fichier demandé n\'a pas été trouvé');
=======
            if (!resource) {
                throw new Error('Le fichier demandé n\'a pas été trouvé');
            }

            await Resource.remove(resource);

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Fichier supprimé',
                `Le fichier "${resource.name}" a été supprimé du système`,
                resource.user.email
            );

            return 'Resource deleted';
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la suppression de fichier',
                `Erreur lors de la suppression du fichier ID ${id}: ${error}`,
                undefined
            );
            throw error;
>>>>>>> origin/dev
        }
    }
}

export default ResourceResolver;
