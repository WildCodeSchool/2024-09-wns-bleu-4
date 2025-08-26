import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
    query getAllUsers {
        getAllUsers {
            id
            email
            role
            subscription {
                id
            }
        }
    }
`;

export const GET_USER_INFO = gql`
    query GetUserInfo {
        getUserInfo {
            email
            isLoggedIn
            id
            isSubscribed
            role
            profilePicture
            storage {
                bytesUsed
                percentage
            }
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
