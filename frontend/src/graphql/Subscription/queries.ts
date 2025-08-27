import { gql } from '@apollo/client';

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($userId: ID!) {
    getUserSubscription(userId: $userId) {
      id
      paidAt
      endAt
    }
  }
`;
