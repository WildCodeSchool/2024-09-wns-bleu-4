import { gql } from '@apollo/client';

export const GET_PAYMENT_INTENT = gql`
  query GetPaymentIntent($paymentIntentId: String!) {
    getPaymentIntent(paymentIntentId: $paymentIntentId)
  }
`;

export const GET_USER_STRIPE_CUSTOMER_ID = gql`
  query GetUserStripeCustomerId {
    getUserStripeCustomerId
  }
`;