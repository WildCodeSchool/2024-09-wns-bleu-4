# 1 - Architecture du projet :

- Frontend : Application React/TypeScript avec Vite et Tailwind CSS  
  
- Backend : Application Node.js/TypeScript  
  
- Storage-API : Service séparé pour la gestion des fichiers  

- Configuration Docker avec nginx comme reverse proxy à la racine


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

Via Docker :
L'application est accessible sur le port 7007 
Un compte administrateur sera crée via Faker automatiquement avec Docker :
email: admin@example.com
mdp : Admin@123456

En développement local :
Frontend : port 5173 en développement local  
Backend : port 4000  
Base de données PostgreSQL incluse  
Adminer pour la gestion de la base de données : port 8080

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
## Interface de test d'emails :
### Terminal - Backend
```
  npm email
```