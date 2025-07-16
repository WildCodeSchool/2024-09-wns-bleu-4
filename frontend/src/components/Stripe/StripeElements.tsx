import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useStripe } from './StripeProvider';
import { PaymentElement } from './PaymentElement';
import { useTheme } from '@/hooks/useTheme';

interface StripeElementsProps {
  clientSecret: string;
  amount: number;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export const StripeElements: React.FC<StripeElementsProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError,
}) => {
  const { stripe, isLoading, error } = useStripe();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!stripe) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600">Stripe is not available</p>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        clientSecret,
        appearance: {
          theme: theme === 'dark' ? 'night' : 'stripe',
          labels: 'floating',
          variables: {
            colorPrimary: '#0ea5e9',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px',
          },
        },
      }}
    >
      <PaymentElement
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}; 