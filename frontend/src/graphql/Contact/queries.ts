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
<<<<<<< HEAD
=======
                    role
>>>>>>> origin/dev
                }
                targetUser {
                    id
                    email
                }
            }
            pendingRequestsReceived {
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
            pendingRequestsSent {
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
    }
`;
