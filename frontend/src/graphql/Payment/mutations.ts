import { gql } from '@apollo/client';

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent(
    $amount: Float!
    $currency: String
    $description: String
    $metadata: String
  ) {
    createPaymentIntent(
      amount: $amount
      currency: $currency
      description: $description
      metadata: $metadata
    )
  }
`;

export const CONFIRM_PAYMENT = gql`
  mutation ConfirmPayment($clientSecret: String!, $paymentMethodId: String!) {
    confirmPayment(clientSecret: $clientSecret, paymentMethodId: $paymentMethodId)
  }
`;

export const CREATE_STRIPE_SUBSCRIPTION = gql`
  mutation CreateStripeSubscription($priceId: String!) {
    createStripeSubscription(priceId: $priceId)
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($subscriptionId: String!) {
    cancelSubscription(subscriptionId: $subscriptionId)
  }
`; 