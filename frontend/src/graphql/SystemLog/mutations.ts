import { gql } from '@apollo/client';

export const CREATE_SYSTEM_LOG = gql`
    mutation CreateSystemLog($data: CreateLogInput!) {
        createSystemLog(data: $data) {
            id
            type
            message
            details
            userId
            createdAt
        }
    }
`;

export const DELETE_SYSTEM_LOG = gql`
    mutation DeleteSystemLog($id: ID!) {
        deleteSystemLog(id: $id)
    }
`;

export const CLEAR_SYSTEM_LOGS = gql`
    mutation ClearSystemLogs {
        clearSystemLogs
    }
`; 