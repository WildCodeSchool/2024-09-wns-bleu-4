import { useEffect, useRef, useState } from 'react';
import { useEnv } from '@/hooks/useEnv';

interface ReCAPTCHAProps {
    onSuccess: (token: string) => void;
    onError?: (error: Error) => void;
}

// Minimal grecaptcha typings
declare global {
    interface Window {
        grecaptcha?: {
            render: (
                container: HTMLElement | string,
                parameters: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                    theme?: 'light' | 'dark';
                    size?: 'normal' | 'compact' | 'invisible';
                },
            ) => number;
            reset: (id?: number) => void;
            ready: (cb: () => void) => void;
        };
    }
}

export const ReCAPTCHA = ({ onSuccess, onError }: ReCAPTCHAProps) => {
    const { isDev, isStaging, isProd } = useEnv();
    const testSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    // Utiliser la clé de test en dev, ou en staging si la clé n'est pas configurée
    // En production, la clé doit être fournie via les build args Docker
    const resolvedSiteKey =
        isDev || (isStaging && !import.meta.env?.VITE_RECAPTCHA_SITE_KEY)
            ? testSiteKey
            : import.meta.env?.VITE_RECAPTCHA_SITE_KEY;
    
    // En production, si la clé n'est pas définie, c'est une erreur de configuration
    if (isProd && !resolvedSiteKey) {
        console.error(
            'reCAPTCHA site key is missing in production. ' +
            'Please ensure RECAPTCHA_SITE_KEY secret is configured in GitHub Actions.'
        );
    }

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [widgetId, setWidgetId] = useState<number | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!resolvedSiteKey) {
            onError?.(new Error('Missing reCAPTCHA site key'));
            return;
        }

        const scriptId = 'google-recaptcha-script';
        const existing = document.getElementById(
            scriptId,
        ) as HTMLScriptElement | null;

        const onLoad = () => {
            setScriptLoaded(true);
        };

        if (!existing) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src =
                'https://www.google.com/recaptcha/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.onload = onLoad;
            script.onerror = () =>
                onError?.(new Error('Failed to load reCAPTCHA script'));
            document.body.appendChild(script);
        } else if (existing && window.grecaptcha) {
            // Script already present and grecaptcha available
            setScriptLoaded(true);
        } else if (existing) {
            existing.addEventListener('load', onLoad);
            return () => existing.removeEventListener('load', onLoad);
        }
    }, [resolvedSiteKey, onError]);

    useEffect(() => {
        if (!scriptLoaded) return;
        if (!containerRef.current) return;
        if (!window.grecaptcha) return;
        if (widgetId !== null) return;

        // Wait until grecaptcha fully initializes (render is available)
        window.grecaptcha.ready(() => {
            try {
                const id = window.grecaptcha!.render(
                    containerRef.current as HTMLDivElement,
                    {
                        sitekey: resolvedSiteKey,
                        callback: (token: string) => {
                            onSuccess(token);
                        },
                        'expired-callback': () => {
                            onError?.(new Error('reCAPTCHA expired'));
                        },
                        'error-callback': () => {
                            onError?.(new Error('reCAPTCHA error'));
                        },
                    },
                );
                setWidgetId(id);
            } catch {
                onError?.(new Error('Failed to initialize reCAPTCHA'));
            }
        });

        return () => {
            try {
                if (window.grecaptcha && widgetId !== null) {
                    window.grecaptcha.reset(widgetId);
                }
            } catch {
                // ignore
            }
        };
    }, [scriptLoaded, resolvedSiteKey, onSuccess, onError, widgetId]);

    if (!resolvedSiteKey) {
        return (
            <div className="text-sm text-red-500">
                reCAPTCHA misconfigured: missing site key
            </div>
        );
    }

    return <div ref={containerRef} />;
};
