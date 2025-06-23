# --- Étape 1: Build de l'application React ---
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier tout le code source de l'application
COPY . .

# Lancer le build de production
RUN npm run build

# --- Étape 2: Servir les fichiers avec Nginx ---
FROM nginx:1.25-alpine

# Copier les fichiers buildés de l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Copier notre configuration Nginx personnalisée pour gérer le routing des SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# La commande par défaut de Nginx s'occupe de démarrer le serveur
CMD ["nginx", "-g", "daemon off;"] 