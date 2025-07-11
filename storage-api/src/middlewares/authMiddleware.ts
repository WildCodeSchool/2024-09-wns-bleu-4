import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import * as cookie from 'cookie';

// ========================================
// EXTENSION DES TYPES EXPRESS
// ========================================
// Cette déclaration permet d'ajouter la propriété 'user' à l'objet Request d'Express
// Grâce à ça, on peut utiliser req.user?.email dans nos contrôleurs
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;      // Email de l'utilisateur connecté
                userRole: string;   // Rôle de l'utilisateur (admin, user, etc.)
            };
        }
    }
}

// ========================================
// MIDDLEWARE D'AUTHENTIFICATION PRINCIPAL
// ========================================
// Cette fonction vérifie si l'utilisateur est authentifié via son token JWT
// Elle s'exécute avant chaque route protégée
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // ========================================
        // ÉTAPE 1: VÉRIFICATION DE LA CONFIGURATION
        // ========================================
        // On vérifie que la clé secrète JWT est définie dans les variables d'environnement
        // Cette clé sert à signer et vérifier les tokens
        if (!process.env.JWT_SECRET_KEY) {
            console.error('JWT_SECRET_KEY not defined');
            res.status(500).json({ 
                message: 'Erreur de configuration serveur' 
            });
            return;
        }

        // ========================================
        // ÉTAPE 2: VÉRIFICATION DE LA PRÉSENCE DE COOKIES
        // ========================================
        // On vérifie que l'utilisateur a envoyé des cookies
        // Les cookies contiennent le token d'authentification
        if (!req.headers.cookie) {
            res.status(401).json({ 
                message: 'Token d\'authentification manquant' 
            });
            return;
        }

        // ========================================
        // ÉTAPE 3: PARSING DES COOKIES
        // ========================================
        // On parse les cookies pour extraire le token
        // Les cookies sont au format "name=value; name2=value2"
        const cookies = cookie.parse(req.headers.cookie);
        
        // On vérifie que le cookie 'token' existe
        if (!cookies.token) {
            res.status(401).json({ 
                message: 'Token d\'authentification manquant' 
            });
            return;
        }

        // ========================================
        // ÉTAPE 4: VÉRIFICATION ET DÉCODAGE DU TOKEN JWT
        // ========================================
        // On vérifie que le token est valide et on le décode
        // jwt.verify() va :
        // - Vérifier la signature du token
        // - Vérifier que le token n'est pas expiré
        // - Retourner le contenu du token (payload)
        const payload: any = jwt.verify(
            cookies.token,                                    // Le token à vérifier
            process.env.JWT_SECRET_KEY as Secret              // La clé secrète pour vérifier
        );

        // ========================================
        // ÉTAPE 5: VÉRIFICATION DU CONTENU DU TOKEN
        // ========================================
        // On vérifie que le token contient bien un email
        // Le payload contient les informations de l'utilisateur
        if (!payload || !payload.email) {
            res.status(401).json({ 
                message: 'Token d\'authentification invalide' 
            });
            return;
        }

        // ========================================
        // ÉTAPE 6: AJOUT DES INFORMATIONS UTILISATEUR À LA REQUÊTE
        // ========================================
        // On ajoute les informations de l'utilisateur à l'objet req
        // Maintenant on peut utiliser req.user?.email dans nos contrôleurs
        req.user = {
            email: payload.email,                    // Email de l'utilisateur
            userRole: payload.userRole || 'user'     // Rôle (par défaut 'user' si pas défini)
        };

        // ========================================
        // ÉTAPE 7: SUCCÈS - PASSAGE AU MIDDLEWARE SUIVANT
        // ========================================
        // L'utilisateur est authentifié, on peut continuer la route
        console.log(`Utilisateur authentifié: ${payload.email}`);
        next(); // Passe au middleware/contrôleur suivant

    } catch (error) {
        // ========================================
        // GESTION DES ERREURS
        // ========================================
        // Si une erreur survient (token invalide, expiré, etc.)
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({ 
            message: 'Token d\'authentification invalide' 
        });
        return;
    }
};

