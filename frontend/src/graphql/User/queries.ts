import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
    query getAllUsers {
        getAllUsers {
            id
            email
<<<<<<< HEAD
=======
            role
            subscription {
                id
            }
>>>>>>> origin/dev
        }
    }
`;

export const GET_USER_INFO = gql`
    query GetUserInfo {
        getUserInfo {
            email
            isLoggedIn
            id
<<<<<<< HEAD
=======
            isSubscribed
            role
            profilePicture
            storage {
                bytesUsed
                percentage
            }
>>>>>>> origin/dev
        }
    }
`;

export const GET_USER_ID = gql`
    query GetUserId {
        getUserInfo {
            id
            email
        }
    }
`;
<<<<<<< HEAD
=======

export const GET_USER_STATS = gql`
    query GetUserStats {
        getAllUsers {
            id
            role
            subscription {
                id
            }
        }
    }
`;
>>>>>>> origin/dev
