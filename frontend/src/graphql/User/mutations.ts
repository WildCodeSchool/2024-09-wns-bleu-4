import { gql } from "@apollo/client";
export const LOGIN = gql`
    mutation Login($data: UserInput!) {
        login(data: $data)
    }
`;
