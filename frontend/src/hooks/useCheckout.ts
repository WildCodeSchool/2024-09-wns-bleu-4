import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} from '@/generated/graphql-types';

interface CheckoutOptions {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

interface CheckoutResult {
  success: boolean;
  error?: string;
  paymentIntentId?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  [key: string]: unknown;
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Apollo mutations
  const [createPaymentIntentMutation] = useCreatePaymentIntentMutation();
  const [confirmPaymentMutation] = useConfirmPaymentMutation();

  const createPaymentIntent = useCallback(
    async (options: CheckoutOptions): Promise<CheckoutResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const metadataString = JSON.stringify({
          userId: user?.id?.toString() || '',
          userEmail: user?.email || '',
          ...options.metadata,
        });
        const { data, errors } = await createPaymentIntentMutation({
          variables: {
            amount: options.amount,
            currency: options.currency || 'eur',
            description: options.description || 'Wild Transfer Subscription',
            metadata: metadataString,
          },
        });
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        }
        return {
          success: true,
          paymentIntentId: data?.createPaymentIntent || undefined,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during checkout';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user, createPaymentIntentMutation]
  );

  const confirmPayment = useCallback(
    async (
      clientSecret: string,
      paymentMethod: PaymentMethod
    ): Promise<CheckoutResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, errors } = await confirmPaymentMutation({
          variables: {
            clientSecret,
            paymentMethodId: paymentMethod.id,
          },
        });
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        }
        return {
          success: !!data?.confirmPayment,
          paymentIntentId: clientSecret,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment confirmation failed';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [confirmPaymentMutation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createPaymentIntent,
    confirmPayment,
    isLoading,
    error,
    clearError,
  };
};
