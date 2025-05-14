import { gql } from '@apollo/client';

export const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($contactToCreate: ContactInput!) {
        sendContactRequest(contactToCreate: $contactToCreate) {
            createdAt
        }
    }
`;
