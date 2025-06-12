import { gql } from '@apollo/client';

export const CREATE_RESOURCE = gql`
    mutation CreateResource($data: ResourceInput!) {
        createResource(data: $data) {
            id
            name
            description
            path
            url
        }
    }
`;
export const DELETE_RESOURCE = gql`
    mutation DeleteResource($deleteResourceId: ID!) {
        deleteResource(id: $deleteResourceId)
    }
`;

export const CREATE_USER_ACCESS = gql`
    mutation CreateUserAccess($resourceId: ID!, $userId: ID!) {
        createUserAccess(resourceId: $resourceId, userId: $userId)
    }
`;