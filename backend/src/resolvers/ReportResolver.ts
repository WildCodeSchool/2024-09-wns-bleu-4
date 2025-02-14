import { Reason, Report } from '@/entities/Report';
import { Resource } from '@/entities/Resource';
import { User } from '@/entities/User';
import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from 'type-graphql';

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

@Resolver(Report)
class ReportResolver {
    @Query(() => [Report])
    async getReportsByUser(@Arg("id", () => ID) id: User['id']): Promise<Report[]> {
        const reports = await Report.findBy({ user: { id: id } });
        return reports;
    }

    @Query(() => [Report])
    async getReportsByResource(@Arg("id", () => ID) id: Resource['id']): Promise<Report[]> {
        const reports = await Report.findBy({ resource: { id: id } });
        return reports;
    }

    @Mutation(() => Report)
    async createReport(@Arg("newReport", () => ReportInput) newReport: Report): Promise<Report> {
        const report = Report.create(newReport);
        await report.save();
        return report;
    }

    @Mutation(() => String)
    async deleteReport(@Arg("id", () => ReportInput) id: ReportInput): Promise<string> {
        await Report.delete(id);
        return "Signalement supprimé";
    }
}

export default ReportResolver;
