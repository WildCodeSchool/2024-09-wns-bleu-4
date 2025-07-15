import { SystemLog, LogType } from '@/entities/SystemLog';
import {
    Arg,
    Ctx,
    Field,
    ID,
    InputType,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class CreateLogInput {
    @Field(() => LogType)
    type: LogType;

    @Field(() => String)
    message: string;

    @Field(() => String, { nullable: true })
    details?: string;

    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    ipAddress?: string;
}

@Resolver(SystemLog)
class SystemLogResolver {
    @Query(() => [SystemLog])
    async getSystemLogs(
        @Arg('limit', () => Number, { defaultValue: 50 }) limit: number,
        @Arg('offset', () => Number, { defaultValue: 0 }) offset: number,
        @Arg('type', () => LogType, { nullable: true }) type?: LogType
    ): Promise<SystemLog[]> {
        const query = SystemLog.createQueryBuilder('log')
            .orderBy('log.createdAt', 'DESC')
            .skip(offset)
            .take(limit);

        if (type) {
            query.where('log.type = :type', { type });
        }

        return await query.getMany();
    }

    @Query(() => SystemLog, { nullable: true })
    async getSystemLogById(
        @Arg('id', () => ID) id: number,
    ): Promise<SystemLog | null> {
        return await SystemLog.findOne({ where: { id } });
    }

    @Mutation(() => SystemLog)
    async createSystemLog(
        @Arg('data', () => CreateLogInput) data: CreateLogInput,
        @Ctx() context: any
    ): Promise<SystemLog> {
        const log = SystemLog.create({
            ...data,
            ipAddress: data.ipAddress || context.ipAddress,
            userId: data.userId || context.email,
        });

        return await SystemLog.save(log);
    }

    @Mutation(() => String)
    async deleteSystemLog(@Arg('id', () => ID) id: number): Promise<string> {
        const log = await SystemLog.findOne({ where: { id } });

        if (!log) {
            throw new Error('Le log demandé n\'a pas été trouvé');
        }

        await SystemLog.remove(log);
        return 'Log supprimé avec succès';
    }

    @Mutation(() => String)
    async clearSystemLogs(): Promise<string> {
        await SystemLog.clear();
        return 'Tous les logs ont été supprimés';
    }

    // Méthode utilitaire pour créer des logs automatiquement
    static async logEvent(
        type: LogType,
        message: string,
        details?: string,
        userId?: string,
        ipAddress?: string
    ): Promise<SystemLog> {
        const log = SystemLog.create({
            type,
            message,
            details,
            userId,
            ipAddress,
        });

        return await SystemLog.save(log);
    }
}

export default SystemLogResolver; 