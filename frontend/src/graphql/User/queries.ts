import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
    query getAllUsers {
        getAllUsers {
            id
            email
        }
    }
`;

export const GET_USER_INFO = gql`
    query GetUserInfo {
        getUserInfo {
            email
            isLoggedIn
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
