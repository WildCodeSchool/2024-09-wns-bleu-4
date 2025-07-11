# Storage API

API de stockage de fichiers avec authentification JWT.

## Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `storage-api` avec :

```env
# Clé secrète JWT (doit être la même que dans le backend principal)
JWT_SECRET_KEY=<Entrer une chaine de caractères>

# Port du serveur (optionnel, par défaut 3001)
PORT=3000
```

## Installation

```bash
npm install
```

## Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## Routes

Toutes les routes nécessitent une authentification via cookie JWT.

## Authentification

L'API utilise le même système d'authentification que le backend principal :
- Vérification du token JWT dans les cookies
- Support des rôles utilisateur 
- Middleware `authMiddleware` pour l'authentification de base

## Logs

L'API enregistre toutes les actions avec l'email de l'utilisateur :
- Upload de fichiers
- Suppression de fichiers
- Consultation de fichiers
- Erreurs d'authentification

## Exemple d'utilisation

```javascript
// Upload d'un fichier
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include' // Important pour les cookies
});

// Liste des fichiers
fetch('/files', {
  credentials: 'include'
});

// Suppression d'un fichier (admin uniquement)
fetch('/delete/filename.ext', {
  method: 'DELETE',
  credentials: 'include'
});
``` 