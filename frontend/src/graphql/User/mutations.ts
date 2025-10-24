import { gql } from '@apollo/client';

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
    mutation Register($data: UserInput!, $lang: String!) {
        register(data: $data, lang: $lang)
    }
`;

//Confirm email
export const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail($codeByUser: String!) {
        confirmEmail(codeByUser: $codeByUser)
    }
`;

export const RESEND_CONFIRMATION_EMAIL = gql`
    mutation ResendConfirmationEmail($email: String!, $lang: String!) {
        resendConfirmationEmail(email: $email, lang: $lang)
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

export const UPDATE_USER_ROLE = gql`
    mutation UpdateUserRole($id: ID!, $role: UserRole!) {
        updateUserRole(id: $id, role: $role)
    }
`;
export const UPDATE_PROFILE_PICTURE = gql`
    mutation UpdateProfilePicture($data: UpdateProfilePictureInput!) {
        updateProfilePicture(data: $data) {
            id
            email
            profilePicture
        }
    }
`;

// Password reset
export const RESET_PASSWORD_SEND_CODE = gql`
    mutation ResetPasswordSendCode($email: String!, $lang: String!) {
        resetPasswordSendCode(email: $email, lang: $lang)
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword)
    }
`;
