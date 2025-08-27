import { gql } from '@apollo/client';

export const CREATE_REPORT = gql`
    mutation CreateReportByIds($input: CreateReportInput!) {
        createReportByIds(input: $input) {
            id
            reason
            content
            createdAt
            user {
                id
                email
            }
            resource {
                id
                name
                user {
                    id
                    email
                }
            }
        }
    }
`;

export const DELETE_REPORT = gql`
    mutation DeleteReport($reportToDelete: ReportInput!) {
        deleteReport(reportToDelete: $reportToDelete)
    }
`;