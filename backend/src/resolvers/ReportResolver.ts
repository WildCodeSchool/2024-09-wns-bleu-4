import { Reason, Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
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
        const user = await User.findOne({ where: { id: input.userId } });
        const resource = await Resource.findOne({ where: { id: input.resourceId } });
        
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
        
        return savedReport;
    }

    @Mutation(() => String)
    async deleteReport(
        @Arg('reportToDelete', () => ReportInput) reportToDelete: ReportInput,
    ): Promise<string> {
        await Report.delete(reportToDelete);
        return 'Signalement supprimé';
    }
}

export default ReportResolver;
