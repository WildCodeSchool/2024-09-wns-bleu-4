interface RecaptchaVerifyResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[];
    score?: number; // Pour reCAPTCHA v3
    action?: string; // Pour reCAPTCHA v3
}

/**
 * Valide un token reCAPTCHA avec l'API Google
 * @param token Le token reCAPTCHA à valider
 * @param remoteIp L'adresse IP du client (optionnel mais recommandé)
 * @returns true si le token est valide, false sinon
 * @throws Error si la validation échoue ou si la clé secrète n'est pas configurée
 */
export async function verifyRecaptchaToken(
    token: string,
    remoteIp?: string,
): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        // En développement, on accepte si pas de clé configurée
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                'RECAPTCHA_SECRET_KEY not configured. Skipping validation in development.',
            );
            return true;
        }
        throw new Error(
            'reCAPTCHA secret key is not configured. Please set RECAPTCHA_SECRET_KEY in environment variables.',
        );
    }

    if (!token) {
        return false;
    }

    try {
        // Construire les paramètres pour le body
        const params = new URLSearchParams();
        params.append('secret', secretKey);
        params.append('response', token);
        if (remoteIp) {
            params.append('remoteip', remoteIp);
        }

        // Faire la requête à l'API Google
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            console.error(
                `reCAPTCHA API error: ${response.status} ${response.statusText}`,
            );
            return false;
        }

        const data: RecaptchaVerifyResponse = await response.json();

        if (!data.success) {
            console.warn('reCAPTCHA validation failed:', data['error-codes']);
            return false;
        }

        // Pour reCAPTCHA v3, on peut aussi vérifier le score (optionnel)
        // Un score < 0.5 indique généralement un bot
        if (data.score !== undefined && data.score < 0.5) {
            console.warn(
                `reCAPTCHA score too low: ${data.score}. Possible bot detected.`,
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying reCAPTCHA token:', error);
        // En cas d'erreur réseau, on peut choisir de rejeter ou d'accepter
        // Ici, on rejette par sécurité
        return false;
    }
}

