# Stripe Integration for Wild Transfer Backend

This document explains how to set up and use the Stripe payment integration in the Wild Transfer backend.

## 🚀 Setup

### 1. Install Dependencies

The Stripe package is already included in `package.json`. Install it with:

```bash
npm install
```

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration

## Backend
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

## Frontend
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Optional: Stripe Price IDs for subscriptions
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id_here
```

### 3. Database Migration

The new entities will be automatically synchronized when you start the server. The following fields have been added:

**User Entity:**
- `stripeCustomerId` (string, nullable) - Stripe customer ID

**Subscription Entity:**
- `stripeSubscriptionId` (string, nullable) - Stripe subscription ID
- `stripePriceId` (string, nullable) - Stripe price ID
- `status` (enum) - Subscription status (active, cancelled, past_due, unpaid)

## 🔧 API Endpoints

### GraphQL Mutations

#### 1. Create Payment Intent
```graphql
mutation CreatePaymentIntent($amount: Float!, $currency: String, $description: String, $metadata: String) {
  createPaymentIntent(
    amount: $amount
    currency: $currency
    description: $description
    metadata: $metadata
  )
}
```

**Variables:**
```json
{
  "amount": 900,
  "currency": "eur",
  "description": "Premium Subscription",
  "metadata": "{\"subscriptionType\":\"premium\"}"
}
```

#### 2. Confirm Payment
```graphql
mutation ConfirmPayment($clientSecret: String!, $paymentMethodId: String!) {
  confirmPayment(
    clientSecret: $clientSecret
    paymentMethodId: $paymentMethodId
  )
}
```

#### 3. Create Stripe Subscription
```graphql
mutation CreateStripeSubscription($priceId: String!) {
  createStripeSubscription(priceId: $priceId)
}
```

#### 4. Cancel Subscription
```graphql
mutation CancelSubscription($subscriptionId: String!) {
  cancelSubscription(subscriptionId: $subscriptionId)
}
```

### GraphQL Queries

#### 1. Get Payment Intent Details
```graphql
query GetPaymentIntent($paymentIntentId: String!) {
  getPaymentIntent(paymentIntentId: $paymentIntentId)
}
```

#### 2. Get User's Stripe Customer ID
```graphql
query GetUserStripeCustomerId {
  getUserStripeCustomerId
}
```

## 🔄 Webhook Handling

### Webhook Endpoint

The webhook handler is available at `/webhooks/stripe`. You'll need to configure this in your Stripe dashboard.

### Supported Events

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled

### Webhook Configuration

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add endpoint: `https://your-domain.com/webhooks/stripe`
4. Select the events listed above
5. Copy the webhook secret to your environment variables

## 🛠️ Services

### StripeService

The `StripeService` class provides the following methods:

- `createPaymentIntent()` - Create payment intents
- `confirmPayment()` - Confirm payments
- `getOrCreateCustomer()` - Manage Stripe customers
- `createSubscription()` - Create subscriptions
- `cancelSubscription()` - Cancel subscriptions
- `handleWebhook()` - Process webhook events

## 🔐 Security

### Authentication

All payment operations require authentication. The `isAuth` middleware ensures users are logged in.

### Webhook Verification

Webhook signatures are verified using the `STRIPE_WEBHOOK_SECRET` to prevent unauthorized requests.

### Error Handling

All Stripe operations include comprehensive error handling and logging.

## 📝 Usage Examples

### Frontend Integration

```typescript
// Create payment intent
const createPaymentIntent = async (amount: number) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreatePaymentIntent($amount: Float!) {
          createPaymentIntent(amount: $amount)
        }
      `,
      variables: { amount }
    }),
    credentials: 'include'
  });
  
  const data = await response.json();
  return data.data.createPaymentIntent;
};
```

### Error Handling

```typescript
try {
  const clientSecret = await createPaymentIntent(900);
  // Use client secret with Stripe Elements
} catch (error) {
  console.error('Payment intent creation failed:', error);
}
```

## 🧪 Testing

### Test Cards

Use these test card numbers in development:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

### Test Mode

All operations use Stripe's test mode by default. Switch to live mode by updating your environment variables with live keys.

## 📊 Monitoring

### Logs

All Stripe operations are logged with appropriate levels:
- `console.log()` for successful operations
- `console.error()` for errors
- `console.warn()` for missing configuration

### Webhook Events

Webhook events are processed asynchronously and logged for debugging.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No (frontend) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature secret | Yes |

### Database

The integration automatically creates the necessary database tables when the server starts.

## 🚨 Troubleshooting

### Common Issues

1. **"Stripe secret key not found"**
   - Ensure `STRIPE_SECRET_KEY` is set in your environment

2. **"Webhook signature verification failed"**
   - Check that `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard

3. **"User not found"**
   - Ensure the user is authenticated before making payment requests

4. **"Payment intent creation failed"**
   - Check your Stripe account status and API key permissions

### Debug Mode

Enable debug logging by setting the log level in your environment:

```env
LOG_LEVEL=debug
```

## 📚 Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [GraphQL Documentation](https://graphql.org/learn/) 