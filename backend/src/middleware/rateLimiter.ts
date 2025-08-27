import rateLimit from 'express-rate-limit';

// Rate limiter pour les mutations d'authentification (login, register, confirmEmail)
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 tentatives par IP par fenêtre
    message: {
        error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
        code: 'RATE_LIMIT_AUTH'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Clé personnalisée pour identifier les utilisateurs
    keyGenerator: (req) => {
        // Utilise l'IP et l'User-Agent pour plus de précision
        return `${req.ip}-${req.get('User-Agent') || 'unknown'}`;
    },
    // Skip les requêtes qui ne sont pas des mutations d'auth
    skip: (req) => {
        const body = req.body;
        if (!body || !body.query) return true;
        
        const authMutations = ['login', 'register', 'confirmEmail'];
        const isAuthMutation = authMutations.some(mutation => 
            body.query.includes(mutation)
        );
        
        return !isAuthMutation;
    }
});

// Rate limiter général pour toutes les mutations
export const generalMutationRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Maximum 30 mutations par minute
    message: {
        error: 'Trop de requêtes. Veuillez ralentir.',
        code: 'RATE_LIMIT_GENERAL'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        const body = req.body;
        if (!body || !body.query) return true;
        return !body.query.includes('mutation');
    }
});
