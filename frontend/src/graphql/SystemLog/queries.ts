import { gql } from '@apollo/client';

export const GET_SYSTEM_LOGS = gql`
    query GetSystemLogs($limit: Float, $offset: Float, $type: LogType) {
        getSystemLogs(limit: $limit, offset: $offset, type: $type) {
            id
            type
            message
            details
            userId
            createdAt
        }
    }
`;

export const GET_SYSTEM_LOG_BY_ID = gql`
    query GetSystemLogById($id: ID!) {
        getSystemLogById(id: $id) {
            id
            type
            message
            details
            userId
            createdAt
        }
    }
`; 