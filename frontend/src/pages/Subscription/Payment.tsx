"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StripeProvider } from '@/components/StripeProvider';
import { StripeElements } from '@/components/StripeElements';
import { useCheckout } from '@/hooks/useCheckout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPaymentIntent, isLoading, error } = useCheckout();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Subscription amount in cents (€9.00 = 900 cents)
  const subscriptionAmount = 900;

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
        console.error('Failed to initialize payment:', err);
      }
    };

    initializePayment();
  }, [user, createPaymentIntent, navigate]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    // In a real implementation, you'd update the user's subscription status
    navigate('/subscription/success');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // You could show a toast notification here
  };

  const handleBack = () => {
    navigate('/subscription');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to continue</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('payment.page.title', 'Complete Your Subscription')}
            </h1>
            <p className="text-gray-600">
              {t('payment.page.description', 'You\'re just one step away from accessing all premium features')}
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">
                  {t('payment.initializing', 'Initializing payment...')}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t('common.retry', 'Try Again')}
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
              <p className="text-gray-600">
                {t('payment.loading', 'Loading payment form...')}
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('payment.security.notice', 'Your payment information is secure and encrypted by Stripe')}
          </p>
        </div>
      </div>
    </div>
  );
}