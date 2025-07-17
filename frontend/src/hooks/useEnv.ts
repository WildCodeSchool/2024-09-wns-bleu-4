import { useMemo } from 'react';

export type Environment = 'DEV' | 'STAGING' | 'PROD';

interface EnvironmentConfig {
  environment: Environment;
  stripePublishableKey: string;
  isDev: boolean;
  isStaging: boolean;
  isProd: boolean;
  features: {
    debugMode: boolean;
    stripe: boolean;
    errorReporting: boolean;
    homeDisclaimer: boolean;
  };
}

interface UseEnvReturn extends EnvironmentConfig {
  // Feature control methods
  isFeatureEnabled: (feature: keyof EnvironmentConfig['features']) => boolean;
  enableFeature: (feature: keyof EnvironmentConfig['features']) => void;
  disableFeature: (feature: keyof EnvironmentConfig['features']) => void;
  // Environment validation
  validateEnvironment: () => { isValid: boolean; errors: string[] };
  // Environment info
  getEnvironmentInfo: () => { environment: Environment; isDev: boolean; isProd: boolean };
}

/**
 * Custom hook for managing environment variables and feature flags
 * 
 * @returns Environment configuration and utility methods
 */
export const useEnv = (): UseEnvReturn => {
  const config = useMemo((): EnvironmentConfig => {
    const environment = (import.meta.env.VITE_ENVIRONMENT as Environment) ?? 'DEV';
    const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
    
    const isDev = environment === 'DEV';
    const isStaging = environment === 'STAGING';
    const isProd = environment === 'PROD';

    return {
      environment,
      stripePublishableKey,
      isDev,
      isStaging,
      isProd,
      features: {
        debugMode: isDev,
        stripe: Boolean(stripePublishableKey) && (isDev || isStaging),
        errorReporting: isDev,
        homeDisclaimer: isProd,
      },
    };
  }, []);

  const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
    return config.features[feature];
  };

  const enableFeature = (feature: keyof EnvironmentConfig['features']): void => {
    // In a real implementation, you might want to persist this to localStorage
    // or dispatch to a global state management system
    console.warn(`Feature ${feature} cannot be enabled/disabled at runtime in this implementation`);
  };

  const disableFeature = (feature: keyof EnvironmentConfig['features']): void => {
    // In a real implementation, you might want to persist this to localStorage
    // or dispatch to a global state management system
    console.warn(`Feature ${feature} cannot be enabled/disabled at runtime in this implementation`);
  };

  const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if environment is set
    if (!import.meta.env.VITE_ENVIRONMENT) {
      errors.push('VITE_ENVIRONMENT is not set');
    }
    
    // Check if environment is valid
    const env = import.meta.env.VITE_ENVIRONMENT;
    if (env && env !== 'DEV' && env !== 'STAGING' && env !== 'PROD') {
      errors.push(`Invalid VITE_ENVIRONMENT value: ${env}. Must be 'DEV', 'STAGING' or 'PROD'`);
    }
    
    // Check Stripe key in production
    if (config.isProd && !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      errors.push('VITE_STRIPE_PUBLISHABLE_KEY is required in PROD environment');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const getEnvironmentInfo = () => ({
    environment: config.environment,
    isDev: config.isDev,
    isProd: config.isProd,
  });

  return {
    ...config,
    isFeatureEnabled,
    enableFeature,
    disableFeature,
    validateEnvironment,
    getEnvironmentInfo,
  };
};

/**
 * Utility function to check if a feature is enabled (for use outside of React components)
 */
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  const env = (import.meta.env.VITE_ENVIRONMENT as Environment) || 'DEV';
  const isDev = env === 'DEV';
  const isStaging = env === 'STAGING';
  const isProd = env === 'PROD';
  
  const features = {
    debugMode: isDev,
    stripe: Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) && (isDev || isStaging),
    errorReporting: isDev,
    homeDisclaimer: isProd,
  };
  
  return features[feature];
};

/**
 * Utility function to get environment info (for use outside of React components)
 */
export const getEnvironmentInfo = () => {
  const environment = (import.meta.env.VITE_ENVIRONMENT as Environment) || 'DEV';
  return {
    environment,
    isDev: environment === 'DEV',
    isProd: environment === 'PROD',
  };
};
