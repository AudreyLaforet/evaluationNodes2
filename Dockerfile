# Utiliser une image de base Node.js
FROM node:14

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port que l'application va utiliser
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
