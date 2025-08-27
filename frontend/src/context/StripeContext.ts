import { Stripe } from "@stripe/stripe-js";
import { createContext } from "react";

export interface StripeContextType {
    stripe: Stripe | null;
    isLoading: boolean;
    error: string | null;
  }

export const StripeContext = createContext<StripeContextType>({
    stripe: null,
    isLoading: true,
    error: null,
  });