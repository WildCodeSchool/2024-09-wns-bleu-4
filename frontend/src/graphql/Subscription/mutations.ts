import { gql } from '@apollo/client';

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($userId: ID!) {
    createSubscription(userId: $userId) {
      id
      paidAt
      endAt
    }
  }
`;

export const DELETE_SUBSCRIPTION = gql`
  mutation DeleteSubscription($userId: ID!) {
    deleteSubscription(userId: $userId)
  }
`;
