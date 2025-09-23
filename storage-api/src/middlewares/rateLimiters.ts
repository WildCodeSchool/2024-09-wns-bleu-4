import rateLimit from 'express-rate-limit';

// Rate limiter pour les uploads permanents (par utilisateur authentifié)
// Limite : 20 uploads par heure par utilisateur
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20, // 20 uploads par heure
    message: {
        error: "Trop d'uploads",
        message:
            "Vous avez atteint la limite d'uploads (20 par heure). Réessayez dans une heure.",
        retryAfter: 3600, // secondes
    },
    standardHeaders: true, // Retourne rate limit info dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    // Utilise l'email de l'utilisateur comme clé (disponible via req.user)
    keyGenerator: (req) => {
        return req.user?.email || 'anonymous-user';
    },
    // Ignore les utilisateurs réussissant (pas d'erreur)
    skipSuccessfulRequests: false,
    // Ignore les utilisateurs échouant (erreurs comptent dans la limite)
    skipFailedRequests: false,
});

// Rate limiter pour les uploads temporaires (par IP avec gestion IPv6)
// Limite : 20 uploads temporaires par heure par IP
export const tempUploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20, // 20 uploads temporaires par heure
    message: {
        error: "Trop d'uploads temporaires",
        message:
            "Vous avez atteint la limite d'uploads temporaires (20 par heure). Réessayez dans une heure.",
        retryAfter: 3600,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter général pour les autres routes (consultation, suppression)
// Limite : 100 requêtes par minute par IP
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requêtes par minute
    message: {
        error: 'Trop de requêtes',
        message: 'Trop de requêtes. Veuillez patienter.',
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter strict pour les routes sensibles (suppression)
// Limite : 30 suppressions par heure par utilisateur
export const deleteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 30, // 30 suppressions par heure
    message: {
        error: 'Trop de suppressions',
        message:
            'Vous avez atteint la limite de suppressions (30 par heure). Réessayez dans une heure.',
        retryAfter: 3600,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.email || 'anonymous-user';
    },
});
