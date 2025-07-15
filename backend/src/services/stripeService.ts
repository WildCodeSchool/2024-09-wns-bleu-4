import Stripe from 'stripe';
import { User } from '@/entities/User';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export interface CreatePaymentIntentOptions {
    amount: number;
    currency: string;
    description: string;
    metadata: Record<string, string>;
    customerId?: string;
}

export interface PaymentIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    customerId?: string;
}

export interface ConfirmPaymentOptions {
    clientSecret: string;
    paymentMethodId: string;
}

export class StripeService {
    /**
     * Create a payment intent for subscription payment
     */
    static async createPaymentIntent(options: CreatePaymentIntentOptions): Promise<PaymentIntentResult> {
        try {
            const { amount, currency, description, metadata, customerId } = options;

            const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
                amount,
                currency,
                description,
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
                capture_method: 'automatic',
            };

            // If customer ID is provided, associate the payment intent
            if (customerId) {
                paymentIntentParams.customer = customerId;
            }

            const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

            return {
                clientSecret: paymentIntent.client_secret!,
                paymentIntentId: paymentIntent.id,
                customerId: paymentIntent.customer as string,
            };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw new Error('Failed to create payment intent');
        }
    }

    /**
     * Confirm a payment using client secret and payment method
     */
    static async confirmPayment(options: ConfirmPaymentOptions): Promise<Stripe.PaymentIntent> {
        try {
            const { clientSecret, paymentMethodId } = options;

            const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
                payment_method: paymentMethodId,
            });

            return paymentIntent;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw new Error('Failed to confirm payment');
        }
    }

    /**
     * Create or retrieve a Stripe customer for a user
     */
    static async getOrCreateCustomer(user: User): Promise<string> {
        try {
            // Check if user already has a Stripe customer ID
            if (user.stripeCustomerId) {
                return user.stripeCustomerId;
            }

            // Create new customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id.toString(),
                },
            });

            // Update user with Stripe customer ID
            user.stripeCustomerId = customer.id;
            await user.save();

            return customer.id;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw new Error('Failed to create customer');
        }
    }

    /**
     * Create a subscription for a user
     */
    static async createSubscription(user: User, priceId: string): Promise<Stripe.Subscription> {
        try {
            const customerId = await this.getOrCreateCustomer(user);

            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    userId: user.id.toString(),
                },
            });

            return subscription;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw new Error('Failed to create subscription');
        }
    }

    /**
     * Cancel a subscription
     */
    static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        try {
            const subscription = await stripe.subscriptions.cancel(subscriptionId);
            return subscription;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw new Error('Failed to cancel subscription');
        }
    }

    /**
     * Retrieve a payment intent by ID
     */
    static async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            console.error('Error retrieving payment intent:', error);
            throw new Error('Failed to retrieve payment intent');
        }
    }

    /**
     * Handle webhook events
     */
    static async handleWebhook(event: Stripe.Event): Promise<void> {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                    break;
                case 'customer.subscription.created':
                    await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                    break;
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.error('Error handling webhook:', error);
            throw error;
        }
    }

    /**
     * Handle successful payment
     */
    private static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const userId = paymentIntent.metadata.userId;
        if (userId) {
            const user = await User.findOneBy({ id: parseInt(userId) });
            if (user) {
                // Update user subscription status
                // This would typically involve creating/updating the subscription entity
                console.log(`Payment succeeded for user ${userId}`);
            }
        }
    }

    /**
     * Handle failed payment
     */
    private static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const userId = paymentIntent.metadata.userId;
        if (userId) {
            console.log(`Payment failed for user ${userId}`);
        }
    }

    /**
     * Handle subscription creation
     */
    private static async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
        const userId = subscription.metadata.userId;
        if (userId) {
            console.log(`Subscription created for user ${userId}`);
        }
    }

    /**
     * Handle subscription updates
     */
    private static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
        const userId = subscription.metadata.userId;
        if (userId) {
            console.log(`Subscription updated for user ${userId}`);
        }
    }

    /**
     * Handle subscription deletion
     */
    private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        const userId = subscription.metadata.userId;
        if (userId) {
            console.log(`Subscription deleted for user ${userId}`);
        }
    }
} 