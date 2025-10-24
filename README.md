# 1 - Architecture du projet :

-   Frontend : Application React/TypeScript avec Vite et Tailwind CSS
-   Backend : Application Node.js/TypeScript
-   Storage-API : Service séparé pour la gestion des fichiers

-   Configuration Docker avec nginx comme reverse proxy à la racine

# 2 - Pour initialiser le projet :

### A. Installation des dépendances

Pour le développement local, vous devez installer les dépendances dans chaque dossier :

Dans le dossier frontend :

```
  cd frontend
```

```
  npm install
```

Dans le dossier backend :

```
  cd ../backend
```

```
  npm install
```

Dans le dossier storage-api :

```
  cd ../storage-api
```

```
  npm install
```

### B. Configuration requise :

Créer un fichier .env dans le dossier '/backend' avec ces champs :

```
NODE_ENV=<development | staging | production>
JWT_SECRET_KEY=<Entrer une chaine de caractères>
RESEND_API_KEY=<Voir section 'api-keys' dans le Discord>
RESEND_EMAIL_DOMAIN=wildtransfer.cloud
```

# 3 - Pour lancer le projet :

Vous avez deux options :

### A. Avec Docker (à la racine) :

```
  docker-compose up --build
```

### B. En développement local (dans 3 terminaux différents) :

### Terminal 1 - Frontend

```
  cd frontend
```

```
  npm run dev
```

### Terminal 2 - Backend

```
  cd backend
```

```
  npm run dev
```

### Terminal 3 - Storage API

```
  cd storage-api
```

```
  npm run dev
```

# 4 - Ports et accès :

## Via Docker (recommandé) :

L'application complète est accessible sur le port **7007** avec nginx comme reverse proxy.

### Comptes de test créés automatiquement :

-   **Administrateur :**

    -   Email : `admin@example.com`
    -   Mot de passe : `Admin@123456`

-   **Utilisateur premium :**
    -   Email : `premium@example.com`
    -   Mot de passe : `Premium@123456`

### Services accessibles :

-   **Application principale :** `http://localhost:7007`
-   **Apollo Studio (GraphQL Playground) :** `http://localhost:7007/api`
-   **Adminer (base de données) :** `http://localhost:7007/adminer`

## En développement local :

### Ports des services :

-   **Frontend :** `http://localhost:5173`
-   **Backend :** `http://localhost:4000`
-   **Storage API :** `http://localhost:3000`
-   **Adminer :** `http://localhost:8080`

### Base de données :

-   **PostgreSQL :** Port interne (non exposé directement)

## Accès à Adminer (interface graphique base de données) :

### URL d'accès :

-   **Via Docker :** `http://localhost:7007/adminer`
-   **Développement local :** `http://localhost:8080`

### Informations de connexion :

-   **Système :** PostgreSQL
-   **Serveur :** `db` (depuis Docker) ou `localhost` (accès direct)
-   **Nom d'utilisateur :** `postgres`
-   **Mot de passe :** `example`
-   **Base de données :** `postgres`

# 5 - Tester le projet :

## Tests unitaires :

### Terminal 1 - Frontend

```
  npm test
```

### Terminal 2 - Backend

```
  npm test
```

### Terminal 3 - Storage API

```
  npm test
```

## Interface de test d'emails :.

### Terminal - Backend

```
  npm email
```
