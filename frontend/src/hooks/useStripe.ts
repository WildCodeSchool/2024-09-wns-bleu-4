import { useContext } from "react";
import { StripeContext } from "@/context/StripeContext";

export const useStripe = () => {
    const context = useContext(StripeContext);
    
    if (context === undefined) {
      throw new Error('useStripe must be used within a StripeProvider');
    }
    
    return context;
  };