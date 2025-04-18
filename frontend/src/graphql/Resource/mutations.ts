import { gql } from '@apollo/client';

export const CREATE_RESOURCE = gql`
    mutation CreateResource($data: ResourceInput!) {
        createResource(data: $data) {
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
