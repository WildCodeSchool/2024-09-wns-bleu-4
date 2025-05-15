import { gql } from '@apollo/client';

export const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($contactToCreate: ContactInput!) {
        sendContactRequest(contactToCreate: $contactToCreate) {
            createdAt
        }
    }
`;

export const ACCEPT_CONTACT_REQUEST = gql`
    mutation AcceptContactRequest($contactId: ID!) {
        acceptContactRequest(contactId: $contactId) {
            id
            status
        }
    }
`;

export const REFUSE_CONTACT_REQUEST = gql`
    mutation RefuseContactRequest($contactId: ID!) {
        refuseContactRequest(contactId: $contactId) {
            id
            status
        }
    }
`;
