FROM node:lts-alpine

WORKDIR /app

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

RUN npm install

# Copie tout le code source
COPY . .

RUN touch .env
ENV IS_DOCKER=true

EXPOSE 3000

# Utilisation de tsx pour exécuter le serveur directement
CMD ["npm", "run", "dev"]
