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

    @Query(() => [User])
    async getUsersWithAccess(
        @Arg('resourceId', () => ID) resourceId: number,
    ): Promise<User[]> {
        const resource = await Resource.findOne({ where: { id: resourceId }, relations: ['usersWithAccess'] });
        return resource?.usersWithAccess ?? [];
    }

    @Mutation(() => String)
    async createUserAccess(
        @Arg('resourceId', () => ID) resourceId: number,
        @Arg('userId', () => ID) userId: number,
    ): Promise<string> {
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
    }

    @Mutation(() => Resource)
    async createResource(
        @Arg('data', () => ResourceInput) data: ResourceInput,
    ): Promise<Resource> {
        try {
            const user = await User.findOne({ where: { id: data.userId } });
            if (!user) {
                throw new Error('L\'utilisateur demandé n\'a pas été trouvé');
            }

            const resource = Resource.create({ ...data, user });

            console.log('Creating resource with data:', resource);

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
        }
    }
}

export default ResourceResolver;
