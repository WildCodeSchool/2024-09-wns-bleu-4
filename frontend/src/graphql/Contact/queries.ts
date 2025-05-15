import { gql } from '@apollo/client';

export const GET_MY_CONTACTS = gql`
    query GetMyContacts {
        getMyContacts {
            id
            status
            createdAt
            sourceUser {
                id
                email
            }
            targetUser {
                id
                email
            }
        }
    }
`;

export const GET_PENDING_CONTACT_REQUESTS = gql`
    query GetPendingContactRequests {
        getPendingContactRequests {
            id
            status
            createdAt
            sourceUser {
                id
                email
            }
            targetUser {
                id
                email
            }
        }
    }
`;
