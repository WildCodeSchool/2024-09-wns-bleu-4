import { gql } from "@apollo/client";

//Login
export const LOGIN = gql`
    mutation Login($data: UserInput!) {
        login(data: $data)
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

//Register
export const REGISTER = gql`
    mutation Register($data: UserInput!) {
        register(data: $data)
    }
`;

//Confirm email
export const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail($codeByUser: String!) {
        confirmEmail(codeByUser: $codeByUser)
    }
`;