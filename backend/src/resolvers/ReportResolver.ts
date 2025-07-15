import { Reason, Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import SystemLogResolver from './SystemLogResolver';
import { LogType } from '@/entities/SystemLog';
import {
    Arg,
    Authorized,
    Field,
    ID,
    InputType,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class ReportInput implements Partial<Report> {
    @Field(() => ID)
    user: User;

    @Field(() => ID)
    resource: Resource;

    @Field(() => String)
    content?: string | undefined;

    @Field(() => Reason)
    reason?: Reason | undefined;
}

@InputType()
export class CreateReportInput {
    @Field(() => ID)
    userId: number;

    @Field(() => ID)
    resourceId: number;

    @Field(() => String, { nullable: true })
    content?: string;

    @Field(() => Reason)
    reason: Reason;
}

@Resolver(Report)
class ReportResolver {
    @Query(() => [Report])
    async getReportsByUser(
        @Arg('id', () => ID) id: User['id'],
    ): Promise<Report[]> {
        const reports = await Report.find({
            where: { user: { id: id } },
            relations: ['user', 'resource'],
        });
        return reports;
    }

    @Query(() => [Report])
    async getReportsByResource(
        @Arg('id', () => ID) id: Resource['id'],
    ): Promise<Report[]> {
        const reports = await Report.find({
            where: { resource: { id: id } },
            relations: ['user', 'resource'],
        });
        return reports;
    }

    @Authorized('admin')
    @Query(() => [Report])
    async getAllReports(): Promise<Report[]> {
        const reports = await Report.find({
            relations: ['user', 'resource', 'resource.user'],
            order: { createdAt: 'DESC' },
        });
        return reports;
    }

    @Mutation(() => Report)
    async createReport(
        @Arg('newReport', () => ReportInput) newReport: Report,
    ): Promise<Report> {
        const report = Report.create(newReport);
        await report.save();
        return report;
    }

    @Mutation(() => Report)
    async createReportByIds(
        @Arg('input', () => CreateReportInput) input: CreateReportInput,
    ): Promise<Report> {
        try {
            const user = await User.findOne({ where: { id: input.userId } });
            const resource = await Resource.findOne({ where: { id: input.resourceId }, relations: ['user'] });
            
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            
            if (!resource) {
                throw new Error('Ressource non trouvée');
            }

            const report = Report.create({
                user,
                resource,
                content: input.content,
                reason: input.reason,
            });
            
            await report.save();
            
            // Recharger le report avec toutes ses relations
            const savedReport = await Report.findOne({
                where: { id: report.id },
                relations: ['user', 'resource', 'resource.user'],
            });
            
            if (!savedReport) {
                throw new Error('Erreur lors de la création du signalement');
            }

            // Traduction des raisons en français
            const reasonTranslations = {
                'corrupted': 'Fichier corrompu',
                'display': 'Problème d\'affichage',
                'inappropriate': 'Contenu inapproprié',
                'harassment': 'Harcèlement',
                'spam': 'Spam',
                'other': 'Autre',
                'none': 'Aucune raison'
            };

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.WARNING,
                'Signalement créé',
                `Signalement créé par ${user.email} pour le fichier "${resource.name}" (raison: ${reasonTranslations[input.reason] || input.reason})`,
                user.email
            );
            
            return savedReport;
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la création de signalement',
                `Erreur lors de la création du signalement: ${error}`,
                undefined
            );
            throw error;
        }
    }

    @Mutation(() => String)
    async deleteReport(
        @Arg('reportToDelete', () => ReportInput) reportToDelete: ReportInput,
    ): Promise<string> {
        try {
            // Récupérer le signalement avec ses relations avant suppression
            const report = await Report.findOne({
                where: { id: reportToDelete.user.id },
                relations: ['user', 'resource']
            });

            await Report.delete(reportToDelete);

            // Log de l'événement
            if (report) {
                await SystemLogResolver.logEvent(
                    LogType.SUCCESS,
                    'Signalement supprimé',
                    `Signalement supprimé pour le fichier "${report.resource.name}"`,
                    report.user.email
                );
            }

            return 'Signalement supprimé';
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la suppression de signalement',
                `Erreur lors de la suppression du signalement: ${error}`,
                undefined
            );
            throw error;
        }
    }
}

export default ReportResolver;
