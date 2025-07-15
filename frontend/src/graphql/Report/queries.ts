import { gql } from '@apollo/client';

export const GET_ALL_REPORTS = gql`
    query GetAllReports {
        getAllReports {
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
                url
                user {
                    id
                    email
                }
            }
        }
    }
`;

export const GET_REPORTS_BY_USER = gql`
    query GetReportsByUser($id: ID!) {
        getReportsByUser(id: $id) {
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
                url
                user {
                    id
                    email
                }
            }
        }
    }
`;

export const GET_REPORTS_BY_RESOURCE = gql`
    query GetReportsByResource($id: ID!) {
        getReportsByResource(id: $id) {
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
                url
                user {
                    id
                    email
                }
            }
        }
    }
`;