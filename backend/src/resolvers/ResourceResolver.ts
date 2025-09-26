import { Resource } from '@/entities/Resource';
import { LogType } from '@/entities/SystemLog';
import { User } from '@/entities/User';
import {
    Arg,
    Ctx,
    Field,
    ID,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { isAuth } from '@/middleware/isAuth';
import SystemLogResolver from './SystemLogResolver';
import { AntivirusService } from '@/services/antivirusService';
import { ScanStatus } from '@/services/antivirusService';

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

@InputType()
export class PaginationInput {
    @Field(() => Number, { defaultValue: 1 })
    page: number = 1;

    @Field(() => Number, { defaultValue: 10 })
    limit: number = 10;
}

@InputType()
export class SearchInput {
    @Field(() => String)
    searchTerm: string;

    @Field(() => Number, { defaultValue: 1 })
    page: number = 1;

    @Field(() => Number, { defaultValue: 10 })
    limit: number = 10;

    @Field(() => [String], { nullable: true })
    types?: string[];

    @Field(() => Number, { nullable: true })
    authorId?: number;
}

@ObjectType()
export class PaginatedResources {
    @Field(() => [Resource])
    resources: Resource[];

    @Field(() => Number)
    totalCount: number;

    @Field(() => Number)
    totalPages: number;

    @Field(() => Number)
    currentPage: number;

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Boolean)
    hasPreviousPage: boolean;
}

@ObjectType()
export class ResourceScanResult {
    @Field(() => ScanStatus)
    status: ScanStatus;

    @Field(() => String, { nullable: true })
    analysisId?: string | null;

    @Field(() => Date, { nullable: true })
    scanDate?: Date | null;

    @Field(() => Number, { nullable: true })
    threatCount?: number | null;

    @Field(() => String, { nullable: true })
    error?: string | null;

    @Field(() => Boolean)
    isProcessing: boolean;

    @Field(() => ID)
    resourceId: number;
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

    @Query(() => PaginatedResources)
    async getResourcesByUserIdPaginated(
        @Arg('userId', () => ID) userId: number,
        @Arg('pagination', () => PaginationInput) pagination: PaginationInput,
    ): Promise<PaginatedResources> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const [resources, totalCount] = await Resource.findAndCount({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            resources,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage,
        };
    }

    @Query(() => PaginatedResources)
    async searchResourcesByUserId(
        @Arg('userId', () => ID) userId: number,
        @Arg('search', () => SearchInput) search: SearchInput,
    ): Promise<PaginatedResources> {
        const { searchTerm, page, limit, types } = search;
        const skip = (page - 1) * limit;

        // Create a query builder for more complex search
        const queryBuilder = Resource.createQueryBuilder('resource')
            .leftJoinAndSelect('resource.user', 'user')
            .where('resource.user.id = :userId', { userId })
            .andWhere('resource.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
            .orderBy('resource.name', 'ASC') // Sort by name for relevance
            .addOrderBy('resource.createdAt', 'DESC'); // Secondary sort by creation date

        // Optional type filters by extension groups
        if (types && types.length > 0) {
            const extensionGroups: Record<string, string[]> = {
                image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
                video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
                audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
                pdf: ['pdf'],
                archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
                document: ['doc', 'docx', 'txt', 'rtf', 'odt'],
                spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
                code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'sql', 'py', 'java', 'c', 'cpp', 'php', 'rb', 'go', 'rs'],
            };

            const selectedExtensions = types
                .flatMap((type) => extensionGroups[type] || [])
                .filter((v, i, a) => a.indexOf(v) === i);

            if (selectedExtensions.length > 0) {
                // Build OR conditions for matching file extensions in the name
                const orConditions: string[] = [];
                const params: Record<string, string> = {};
                selectedExtensions.forEach((ext, idx) => {
                    const key = `ext${idx}`;
                    orConditions.push(`resource.name ILIKE :${key}`);
                    params[key] = `%.${ext}`;
                });
                queryBuilder.andWhere(`(${orConditions.join(' OR ')})`, params);
            }
        }

        // Get total count for pagination
        const totalCount = await queryBuilder.getCount();

        // Apply pagination
        const resources = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            resources,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage,
        };
    }

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

    @Query(() => [User])
    async getUsersWithAccess(
        @Arg('resourceId', () => ID) resourceId: number,
    ): Promise<User[]> {
        const resource = await Resource.findOne({
            where: { id: resourceId },
            relations: ['usersWithAccess'],
        });
        return resource?.usersWithAccess || [];
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
                throw new Error("Le fichier demandé n'a pas été trouvé");
            }

            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error("L'utilisateur demandé n'a pas été trouvé");
            }

            // Check if user already has access to this resource
            if (resource.usersWithAccess.some((u) => u.id === user.id)) {
                return 'User already has access to this resource';
            } else {
                resource.usersWithAccess.push(user);
                await Resource.save(resource);

                // Log de l'événement
                await SystemLogResolver.logEvent(
                    LogType.SUCCESS,
                    'Accès fichier accordé',
                    `L'accès au fichier "${resource.name}" a été accordé à l'utilisateur ${user.email}`,
                    resource.user.email,
                );

                return 'Access granted';
            }
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                "Erreur lors de l'accord d'accès",
                `Erreur lors de l'accord d'accès au fichier ID ${resourceId}: ${error}`,
                undefined,
            );
            throw error;
        }
    }

    @Mutation(() => Resource)
    async createResource(
        @Arg('data', () => ResourceInput) data: ResourceInput,
    ): Promise<Resource> {
        try {
            const user = await User.findOne({
                where: { id: data.userId },
                relations: ['subscription'],
            });
            if (!user) {
                throw new Error("L'utilisateur demandé n'a pas été trouvé");
            }
            const existingResource = await Resource.findOne({
                where: { name: data.name, user: { id: data.userId } },
            });
            if (existingResource) {
                throw new Error('Une ressource avec ce nom existe déjà');
            }

            // Only check storage limit for non-subscribed users
            if (!user.subscription) {
                const MAX_STORAGE_BYTES = 10485760; // 10MB = 10 × 1024 × 1024 = 10,485,760 bytes

                // Get current user's total file size
                const currentTotalSize = await this.getUserTotalFileSize(
                    data.userId,
                );

                // Check if adding this file would exceed the limit
                if (currentTotalSize + data.size > MAX_STORAGE_BYTES) {
                    throw new Error(
                        'Storage limit exceeded. This file would exceed your 10MB storage limit.',
                    );
                }
            }

            // Set expiration date for non-subscribed users (90 days)
            const resourceData: any = { 
                ...data, 
                user, 
                size: data.size,
                scanStatus: ScanStatus.PENDING,
            };
            if (!user.subscription) {
                resourceData.expireAt = new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000,
                );
            }

            const resource = Resource.create(resourceData);
            const savedResource = await Resource.save(resource);

            // Start antivirus scan asynchronously with a delay to ensure file is uploaded
            setTimeout(() => {
                this.performAntivirusScan(savedResource, data.path, user.email);
            }, 5000); // Wait 5 seconds for file upload to complete

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Fichier créé',
                `Le fichier "${data.name}" a été créé par l'utilisateur ${user.email}`,
                user.email,
            );

            return savedResource;
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la création de fichier',
                `Erreur lors de la création du fichier "${data.name}": ${error}`,
                undefined,
            );
            throw error;
        }
    }

    @Mutation(() => String)
    async deleteResource(@Arg('id', () => ID) id: string): Promise<String> {
        try {
            const resource = await Resource.findOne({
                where: { id: parseInt(id) },
                relations: ['user', 'usersWithAccess', 'reports'],
            });

            if (!resource) {
                throw new Error("Le fichier demandé n'a pas été trouvé");
            }

            await Resource.remove(resource);

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Fichier supprimé',
                `Le fichier "${resource.name}" a été supprimé du système`,
                resource.user.email,
            );

            return 'Resource deleted';
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la suppression de fichier',
                `Erreur lors de la suppression du fichier ID ${id}: ${error}`,
                undefined,
            );
            throw error;
        }
    }

    @Mutation(() => Resource)
    @UseMiddleware(isAuth)
    async updateResourceDescription(
        @Arg('id', () => ID) id: number,
        @Arg('description', () => String) description: string,
        @Ctx() context: any,
    ): Promise<Resource> {
        try {
            const resource = await Resource.findOne({
                where: { id },
                relations: ['user'],
            });

            if (!resource) {
                throw new Error('Le fichier demandé n\'a pas été trouvé');
            }

            // Ensure only the owner can update
            const requestingUser = await User.findOne({
                where: { email: context.email },
            });

            if (!requestingUser || resource.user.id !== requestingUser.id) {
                throw new Error('Vous n\'êtes pas autorisé à modifier ce fichier');
            }

            resource.description = description;
            await Resource.save(resource);

            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Fichier mis à jour',
                `La description du fichier "${resource.name}" a été mise à jour`,
                resource.user?.email,
            );

            return resource;
        } catch (error) {
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la mise à jour de fichier',
                `Erreur lors de la mise à jour de la description du fichier ID ${id}: ${error}`,
                undefined,
            );
            throw error;
        }
    }

    /**
     * Perform antivirus scan asynchronously
     */
    private async performAntivirusScan(
        resource: Resource,
        filePath: string,
        userEmail: string,
    ): Promise<void> {
        try {
            // Update status to scanning
            resource.scanStatus = ScanStatus.SCANNING;
            await Resource.save(resource);

            // Perform the scan
            const scanResult = await AntivirusService.scanFile(
                filePath,
                resource.name,
                userEmail,
            );

            // Update resource with scan results
            resource.scanStatus = scanResult.status;
            if (scanResult.analysisId) {
                resource.scanAnalysisId = scanResult.analysisId;
            }
            if (scanResult.scanDate) {
                resource.scanDate = scanResult.scanDate;
            }
            if (scanResult.threatCount !== undefined) {
                resource.threatCount = scanResult.threatCount;
            }
            if (scanResult.error) {
                resource.scanError = scanResult.error;
            }

            await Resource.save(resource);

            // If file is infected, log a warning
            if (scanResult.status === ScanStatus.INFECTED) {
                await SystemLogResolver.logEvent(
                    LogType.ERROR,
                    'Fichier infecté détecté',
                    `Le fichier "${resource.name}" a été détecté comme infecté par ${scanResult.threatCount} moteurs antivirus`,
                    userEmail,
                );
            }

        } catch (error) {
            // Update resource with error status
            resource.scanStatus = ScanStatus.ERROR;
            resource.scanError = error instanceof Error ? error.message : 'Unknown error';
            await Resource.save(resource);

            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors du scan antivirus',
                `Erreur lors du scan antivirus du fichier "${resource.name}": ${error}`,
                userEmail,
            );
        }
    }

    /**
     * Check the status of an antivirus scan
     */
    @Query(() => Resource, { nullable: true })
    async getResourceScanStatus(
        @Arg('resourceId', () => ID) resourceId: number,
    ): Promise<Resource | null> {
        const resource = await Resource.findOne({
            where: { id: resourceId },
            relations: ['user'],
        });

        if (!resource) {
            return null;
        }

        // If scan is still in progress, check for updates
        if (resource.scanStatus === ScanStatus.SCANNING && resource.scanAnalysisId) {
            try {
                const scanResult = await AntivirusService.checkScanStatus(
                    resource.scanAnalysisId,
                    resource.name,
                    resource.user?.email,
                );

                // Update resource if status changed
                if (scanResult.status !== resource.scanStatus) {
                    resource.scanStatus = scanResult.status;
                    if (scanResult.scanDate) {
                        resource.scanDate = scanResult.scanDate;
                    }
                    if (scanResult.threatCount !== undefined) {
                        resource.threatCount = scanResult.threatCount;
                    }
                    if (scanResult.error) {
                        resource.scanError = scanResult.error;
                    }
                    await Resource.save(resource);
                }
            } catch (error) {
                console.error('Error checking scan status:', error);
            }
        }

        return resource;
    }

    /**
     * Return a ScanResult-like object for UI polling/loader control
     */
    @Query(() => ResourceScanResult, { nullable: true })
    async getResourceScanResult(
        @Arg('resourceId', () => ID) resourceId: number,
    ): Promise<ResourceScanResult | null> {
        const resource = await Resource.findOne({
            where: { id: resourceId },
            relations: ['user'],
        });

        if (!resource) return null;

        // If scanning and we have an analysis id, try to refresh
        if (
            resource.scanStatus === ScanStatus.SCANNING &&
            resource.scanAnalysisId
        ) {
            try {
                const scan = await AntivirusService.checkScanStatus(
                    resource.scanAnalysisId,
                    resource.name,
                    resource.user?.email,
                );

                // Persist any change
                if (scan.status !== resource.scanStatus) {
                    resource.scanStatus = scan.status;
                    if (scan.scanDate) resource.scanDate = scan.scanDate;
                    if (scan.threatCount !== undefined)
                        resource.threatCount = scan.threatCount;
                    if (scan.error) resource.scanError = scan.error;
                    await Resource.save(resource);
                }
            } catch (e) {
                // ignore transient errors; UI will continue polling
            }
        }

        return {
            status: resource.scanStatus,
            analysisId: resource.scanAnalysisId,
            scanDate: resource.scanDate ?? null,
            threatCount: resource.threatCount ?? null,
            error: resource.scanError ?? null,
            isProcessing: resource.scanStatus === ScanStatus.SCANNING,
            resourceId: resource.id,
        };
    }
}

export default ResourceResolver;
