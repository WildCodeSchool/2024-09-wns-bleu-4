import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { StripeContext } from '@/context/StripeContext';
import { StripeContextType } from '@/context/StripeContext';

interface StripeProviderProps {
  children: React.ReactNode;
  publishableKey: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  publishableKey 
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!publishableKey) {
          throw new Error('Stripe publishable key is required');
        }

        const stripeInstance = await loadStripe(publishableKey);
        
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe');
        }

        setStripe(stripeInstance);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Stripe';
        setError(errorMessage);
        console.error('Stripe initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, [publishableKey]);

  const value: StripeContextType = {
    stripe,
    isLoading,
    error,
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
}; 