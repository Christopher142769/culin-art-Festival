# Guide de Déploiement sur Render

## 📋 Ce qui sera conservé

### ✅ **Code Source**
- Tous vos fichiers de code seront conservés
- Toutes les modifications que vous avez faites
- Le design, les styles, les composants

### ⚠️ **Données (localStorage)**
- **Problème actuel** : Les templates et logo sont stockés dans `localStorage` (côté navigateur)
- Chaque visiteur a son propre `localStorage`
- Les données ne sont pas partagées entre utilisateurs

## 🚀 Solution : Backend avec API

J'ai créé un backend Express qui stocke les templates et le logo sur le serveur.

### Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Tester en local** :
```bash
npm run build
npm start
```

### Déploiement sur Render

1. **Connecter votre repo GitHub à Render**
2. **Créer un nouveau Web Service**
3. **Configuration** :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Environment** : `Node`
   - **Port** : Render définit automatiquement le port via `PORT`

4. **Variables d'environnement** (optionnel) :
   - `NODE_ENV=production`
   - `PORT=10000` (Render le définit automatiquement)

### Structure des fichiers

```
uploads/
  ├── active-template.json  (template actif)
  ├── logo.json             (logo du festival)
  └── [fichiers images]     (templates et logos uploadés)
```

### API Endpoints

- `GET /api/template` - Récupérer le template actif
- `POST /api/template` - Uploader un template
- `GET /api/logo` - Récupérer le logo
- `POST /api/logo` - Uploader le logo

### ⚠️ Important pour Render

1. **Dossier uploads** : Render peut réinitialiser le système de fichiers
   - Pour la persistance, utilisez un service de stockage cloud (AWS S3, Cloudinary, etc.)
   - Ou utilisez une base de données (PostgreSQL, MongoDB)

2. **Alternative simple** : Utiliser un service de stockage cloud
   - Cloudinary (gratuit jusqu'à 25GB)
   - AWS S3
   - Imgur API

### Prochaines étapes recommandées

Pour une solution de production robuste :
1. Intégrer Cloudinary ou AWS S3 pour le stockage
2. Ajouter une base de données pour les templates multiples
3. Ajouter l'authentification sécurisée


