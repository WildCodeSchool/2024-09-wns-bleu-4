"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StripeProvider } from '@/components/Stripe/StripeProvider';
import { StripeElements } from '@/components/Stripe/StripeElements';
import { useCheckout } from '@/hooks/useCheckout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateSubscriptionMutation } from '@/generated/graphql-types';

export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPaymentIntent, isLoading, error } = useCheckout();
  const [createSubscription] = useCreateSubscriptionMutation();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Subscription amount in cents (€4.00 = 400 cents)
  const subscriptionAmount = 400;

  useEffect(() => {
    const initializePayment = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      try {
        const result = await createPaymentIntent({
          amount: subscriptionAmount,
          currency: 'eur',
          description: 'Wild Transfer Premium Subscription',
          metadata: {
            subscriptionType: 'premium',
            userId: user.id.toString(),
          },
        });

        if (result.success && result.paymentIntentId) {
          // The paymentIntentId returned from GraphQL is actually the client secret
          setClientSecret(result.paymentIntentId);
        }
      } catch (err) {
        toast.error(err as string);
      }
    };

    initializePayment();
  }, [user, createPaymentIntent, navigate]);

  const handlePaymentSuccess = async () => {
    if (user?.id) {
      try {
        await createSubscription({ variables: { userId: user.id.toString() } });
      } catch {
        toast.error(t('payment.error.message'));
      }
    }
    toast.success(t('payment.success.message'));
    navigate('/subscription/success');
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="dark:bg-black min-h-screen bg-gray-50 py-8">
      
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/subscription')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
          </Button>
        </div>

        {/* Payment Form */}
        <div className="bg-white dark:bg-black">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600 dark:text-white">
                  {t('payment.initializing')}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 dark:text-white mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t('common.retry')}
              </Button>
            </div>
          ) : clientSecret ? (
            <StripeProvider publishableKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'}>
              <StripeElements
                clientSecret={clientSecret}
                amount={subscriptionAmount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-white">
                {t('payment.loading')}
              </p>
            </div>
          )}
        </div>
      </div>
  );
}