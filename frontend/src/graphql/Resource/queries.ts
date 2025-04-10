import { gql } from '@apollo/client';

export const GET_ALL_RESOURCES = gql`
    query GetAllResources {
        getAllResources {
            name
            description
            path
            url
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
