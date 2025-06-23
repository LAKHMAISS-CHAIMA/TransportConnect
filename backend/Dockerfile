# Étape 1: Utiliser une image Node.js officielle comme base
FROM node:18-alpine AS base

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Étape 2: Installer les dépendances
FROM base AS deps
# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Étape 3: Exécuter l'application
FROM base AS runner
# Copier les dépendances installées
COPY --from=deps /app/node_modules ./node_modules
# Copier le reste du code source de l'application
COPY . .

RUN mkdir -p logs

# Exposer le port sur lequel le serveur tourne
EXPOSE 5000

# Commande pour démarrer le serveur
# Utilise node directement pour une meilleure gestion des signaux
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js", "--env", "production"] 