import { gql } from '@apollo/client';

export const GET_MY_CONTACTS = gql`
  query GetMyContacts {
    getMyContacts {
      id
      status
      createdAt
      sourceUser {
        email
      }
      targetUser {
        email
      }
    }
  }
`;