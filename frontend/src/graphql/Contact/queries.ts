import { gql } from '@apollo/client';

export const GET_MY_CONTACTS = gql`
    query GetMyContacts {
        getMyContacts {
            acceptedContacts {
                id
                status
                createdAt
                sourceUser {
                    id
                    email
                    role
                }
                targetUser {
                    id
                    email
                    role
                }
            }
            pendingRequestsReceived {
                id
                status
                createdAt
                sourceUser {
                    id
                    email
                    role
                }
                targetUser {
                    id
                    email
                    role
                }
            }
            pendingRequestsSent {
                id
                status
                createdAt
                sourceUser {
                    id
                    email
                    role
                }
                targetUser {
                    id
                    email
                    role
                }
            }
        }
    }
`;
