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
