import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '@/entities/User';
import { StripeService } from '@/services/stripeService';
import { isAuth } from '@/middleware/isAuth';

@Resolver()
class PaymentResolver {
    /**
     * Create a payment intent for subscription payment
     */
    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async createPaymentIntent(
        @Arg('amount', () => Number) amount: number,
        @Arg('currency', () => String, { defaultValue: 'eur' }) currency: string,
        @Arg('description', () => String, { defaultValue: 'Wild Transfer Subscription' }) description: string,
        @Arg('metadata', () => String, { nullable: true }) metadataJson: string,
    ): Promise<string> {
        try {
            // Get user from context
            const user = await User.findOneBy({ email: (global as any).context?.email });
            if (!user) {
                throw new Error('User not found');
            }

            // Parse metadata
            const metadata: Record<string, string> = {
                userId: user.id.toString(),
                userEmail: user.email,
            };

            if (metadataJson) {
                try {
                    const parsedMetadata = JSON.parse(metadataJson);
                    Object.assign(metadata, parsedMetadata);
                } catch (error) {
                    console.error('Error parsing metadata:', error);
                }
            }

            // Get or create Stripe customer
            const customerId = await StripeService.getOrCreateCustomer(user);

            // Create payment intent
            const result = await StripeService.createPaymentIntent({
                amount,
                currency,
                description,
                metadata,
                customerId,
            });

            return result.clientSecret;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw new Error('Failed to create payment intent');
        }
    }

    /**
     * Confirm a payment
     */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async confirmPayment(
        @Arg('clientSecret', () => String) clientSecret: string,
        @Arg('paymentMethodId', () => String) paymentMethodId: string,
    ): Promise<boolean> {
        try {
            const paymentIntent = await StripeService.confirmPayment({
                clientSecret,
                paymentMethodId,
            });

            if (paymentIntent.status === 'succeeded') {
                // Update user subscription
                const user = await User.findOneBy({ email: (global as any).context?.email });
                if (user) {
                    // Create or update subscription
                    await this.createOrUpdateSubscription(user);
                }
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw new Error('Failed to confirm payment');
        }
    }

    /**
     * Create a Stripe subscription
     */
    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async createStripeSubscription(
        @Arg('priceId', () => String) priceId: string,
    ): Promise<string> {
        try {
            const user = await User.findOneBy({ email: (global as any).context?.email });
            if (!user) {
                throw new Error('User not found');
            }

            const subscription = await StripeService.createSubscription(user, priceId);
            return subscription.id;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw new Error('Failed to create subscription');
        }
    }

    /**
     * Cancel a subscription
     */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async cancelSubscription(
        @Arg('subscriptionId', () => String) subscriptionId: string,
    ): Promise<boolean> {
        try {
            await StripeService.cancelSubscription(subscriptionId);
            return true;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw new Error('Failed to cancel subscription');
        }
    }

    /**
     * Get payment intent details
     */
    @Query(() => String)
    @UseMiddleware(isAuth)
    async getPaymentIntent(
        @Arg('paymentIntentId', () => String) paymentIntentId: string,
    ): Promise<string> {
        try {
            const paymentIntent = await StripeService.getPaymentIntent(paymentIntentId);
            return JSON.stringify({
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                created: paymentIntent.created,
            });
        } catch (error) {
            console.error('Error retrieving payment intent:', error);
            throw new Error('Failed to retrieve payment intent');
        }
    }

    /**
     * Get user's Stripe customer ID
     */
    @Query(() => String, { nullable: true })
    @UseMiddleware(isAuth)
    async getUserStripeCustomerId(): Promise<string | null> {
        try {
            const user = await User.findOneBy({ email: (global as any).context?.email });
            if (!user) {
                throw new Error('User not found');
            }

            if (user.stripeCustomerId) {
                return user.stripeCustomerId;
            }

            // Create customer if doesn't exist
            const customerId = await StripeService.getOrCreateCustomer(user);
            return customerId;
        } catch (error) {
            console.error('Error getting customer ID:', error);
            throw new Error('Failed to get customer ID');
        }
    }

    /**
     * Helper method to create or update subscription
     */
    private async createOrUpdateSubscription(user: User): Promise<void> {
        try {
            // Import Subscription entity here to avoid circular dependency
            const { Subscription } = await import('@/entities/Subscription');
            
            // Check if user already has a subscription
            let subscription = await Subscription.findOne({
                where: { user: { id: user.id } },
            });

            if (subscription) {
                // Update existing subscription
                subscription.paidAt = new Date();
                subscription.endAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
                subscription.status = 'active' as any;
                await subscription.save();
            } else {
                // Create new subscription
                subscription = Subscription.create({
                    paidAt: new Date(),
                    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    status: 'active' as any,
                    user,
                });
                await subscription.save();
            }

            // Update user's subscription
            user.subscription = subscription;
            await user.save();
        } catch (error) {
            console.error('Error creating/updating subscription:', error);
            throw error;
        }
    }
}

export default PaymentResolver; 