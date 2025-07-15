import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement as StripePaymentElement } from '@stripe/react-stripe-js';
import { useCheckout } from '@/hooks/useCheckout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PaymentElementProps {
  clientSecret: string;
  amount: number;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export const PaymentElement: React.FC<PaymentElementProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { confirmPayment, isLoading, error, clearError } = useCheckout();
  
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setPaymentError(error);
      setPaymentStatus('error');
    }
  }, [error]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError('Stripe is not initialized');
      setPaymentStatus('error');
      return;
    }

    setPaymentStatus('processing');
    clearError();

    try {
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setPaymentError(submitError.message || 'Payment submission failed');
        setPaymentStatus('error');
        onError?.(submitError.message || 'Payment submission failed');
        return;
      }

      // For this template, we'll use a simplified approach
      // In a real implementation, you'd handle the payment method creation properly
      const result = await confirmPayment(clientSecret, {
        id: 'temp_payment_method',
        type: 'card',
      });

      if (result.success) {
        setPaymentStatus('success');
        onSuccess?.(result.paymentIntentId || '');
      } else {
        setPaymentError(result.error || 'Payment failed');
        setPaymentStatus('error');
        onError?.(result.error || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setPaymentError(errorMessage);
      setPaymentStatus('error');
      onError?.(errorMessage);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-green-600">
          {t('payment.success.title')}
        </h2>
        <p className="text-gray-600 dark:text-white text-center">
          {t('payment.success.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {t('payment.title', 'Complete Your Payment')}
        </h2>
        <p className="text-gray-600 dark:text-muted-foreground">
          {t('payment.description')}
        </p>
        <div className="text-lg font-semibold text-primary">
          {formatAmount(amount)}
        </div>
      </div>

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-4 w-4 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{paymentError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <StripePaymentElement
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  name: 'Customer Name', // You can pre-fill this
                  email: 'customer@example.com', // You can pre-fill this
                },
              },
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={!stripe || isLoading || paymentStatus === 'processing'}
          className="w-full"
        >
          {paymentStatus === 'processing' || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('payment.processing', 'Processing...')}
            </>
          ) : (
            t('payment.pay', 'Pay Now')
          )}
        </Button>
      </form>

      <div className="text-xs text-gray-500 dark:text-white text-center">
        {t('payment.security.notice', 'Your payment information is secure and encrypted')}
      </div>
    </div>
  );
}; 