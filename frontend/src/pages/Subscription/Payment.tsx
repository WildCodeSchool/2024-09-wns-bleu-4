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
import { useEnv } from '@/hooks/useEnv';

export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPaymentIntent, isLoading, error } = useCheckout();
  const [createSubscription] = useCreateSubscriptionMutation();
  const { isFeatureEnabled } = useEnv();
  
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

  // If stripe is not enabled, show a message
  if (!isFeatureEnabled('stripe')) {
    return (
      <div className="dark:bg-black min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate('/subscription')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </div>
          
          <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('payment.stripe_unavailable.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('payment.stripe_unavailable.description')}
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/subscription')}
                className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
              >
                {t('payment.stripe_unavailable.return')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full cursor-pointer"
              >
                {t('payment.stripe_unavailable.home')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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