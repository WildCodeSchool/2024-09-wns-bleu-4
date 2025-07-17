import { gql } from '@apollo/client';

export const GET_ALL_RESOURCES = gql`
    query GetAllResources {
        getAllResources {
            id
            name
            description
            path
            url
            user {
                id
                email
            }
        }
    }
`;

export const GET_RESOURCES_BY_USER_ID = gql`
    query GetResourcesByUserId($userId: ID!) {
        getResourcesByUserId(userId: $userId) {
            description
            id
            name
            path
            url
        }
    }
`;

export const GET_SHARED_RESOURCES = gql`
    query GetUserSharedResources($userId: ID!) {
        getUserSharedResources(userId: $userId) {
            id
            name
            description
            path
            url
            user {
                id
                email
                createdAt
                profilePicture
            }
        }
    }
`;

export const GET_RESOURCE_STATS = gql`
    query GetResourceStats {
        getAllResources {
            id
        }
    }
`;
