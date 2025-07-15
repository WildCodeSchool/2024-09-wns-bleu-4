import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from '@/services/stripeService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event: Stripe.Event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            endpointSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Invalid signature' });
    }

    try {
        // Handle the event
        await StripeService.handleWebhook(event);
        
        // Return a 200 response to acknowledge receipt of the event
        return res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ error: 'Webhook handler failed' });
    }
};

export const getWebhookEndpoint = () => {
    return '/webhooks/stripe';
}; 