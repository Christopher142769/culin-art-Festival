# 🚀 Guide de Déploiement sur Render

Ce guide vous explique comment déployer votre application Culin'Art Festival sur Render.

## 📋 Prérequis

1. Un compte sur [Render.com](https://render.com) (gratuit)
2. Votre code sur GitHub, GitLab ou Bitbucket
3. Node.js installé localement pour tester

---

## 🎯 Option 1 : Déploiement avec un seul service (Recommandé)

Cette option déploie le backend Express qui sert aussi le frontend buildé.

### Étape 1 : Préparer le projet

1. **Assurez-vous que votre code est sur GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prêt pour déploiement Render"
   git push origin main
   ```

2. **Vérifiez que le build fonctionne**
   ```bash
   npm run build
   ```

### Étape 2 : Créer le service sur Render

1. **Connectez-vous à [Render Dashboard](https://dashboard.render.com)**

2. **Cliquez sur "New +" → "Web Service"**

3. **Connectez votre repository GitHub/GitLab**

4. **Configurez le service :**
   - **Name** : `culinart-festival` (ou votre choix)
   - **Region** : Choisissez la région la plus proche (ex: Frankfurt)
   - **Branch** : `main` (ou votre branche principale)
   - **Root Directory** : Laissez vide (racine du projet)
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free` (pour commencer)

5. **Variables d'environnement** (optionnel pour l'instant) :
   - `PORT` : Render définit automatiquement le port, mais vous pouvez ajouter `PORT=10000` si besoin
   - `NODE_ENV` : `production`

6. **Cliquez sur "Create Web Service"**

### Étape 3 : Configuration importante

⚠️ **IMPORTANT** : Sur Render, le système de fichiers est **éphémère**. Les fichiers uploadés seront perdus lors des redémarrages.

**Solutions possibles :**

#### Option A : Utiliser un service de stockage externe (Recommandé pour production)
- AWS S3
- Cloudinary
- Google Cloud Storage

#### Option B : Utiliser Render Disk (Payant)
- Ajouter un Disk persistant dans les settings du service

#### Option C : Pour le développement/test
- Les fichiers seront perdus mais l'application fonctionnera

### Étape 4 : Modifier server.js pour Render

Le fichier `server.js` doit être adapté pour Render. Vérifiez que :

```javascript
const PORT = process.env.PORT || 3001
```

Render définit automatiquement `process.env.PORT`, donc ça devrait fonctionner.

---

## 🎯 Option 2 : Déploiement séparé (Frontend + Backend)

### Frontend (Static Site)

1. **New + → Static Site**
2. **Connectez votre repo**
3. **Configuration :**
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
   - **Environment** : Ajoutez une variable pour l'URL de l'API backend

### Backend (Web Service)

1. **New + → Web Service**
2. **Même configuration que l'Option 1**
3. **CORS** : Configurez pour autoriser votre domaine frontend

---

## 📝 Fichier render.yaml (Configuration as Code)

Vous pouvez utiliser le fichier `render.yaml` existant pour automatiser le déploiement :

```yaml
services:
  - type: web
    name: culinart-festival
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

Pour utiliser ce fichier :
1. Assurez-vous qu'il est dans votre repo
2. Render le détectera automatiquement lors de la création du service

---

## 🔧 Configuration CORS pour production

Si vous déployez frontend et backend séparément, modifiez `server.js` :

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://votre-site.onrender.com',
  credentials: true
}
app.use(cors(corsOptions))
```

---

## 📁 Gestion des uploads sur Render

### Problème : Fichiers éphémères

Sur Render (plan gratuit), le système de fichiers est **éphémère**. Les fichiers uploadés seront perdus lors des redémarrages.

### Solutions :

#### 1. **Render Disk** (Payant - ~$0.25/GB/mois)
- Dans les settings du service → Add Disk
- Modifiez `server.js` pour pointer vers le disk monté

#### 2. **Service de stockage cloud** (Recommandé)
- **Cloudinary** (gratuit jusqu'à 25GB)
- **AWS S3**
- **Google Cloud Storage**

#### 3. **Base de données pour métadonnées**
- Utilisez PostgreSQL (gratuit sur Render) pour stocker les URLs des fichiers
- Les fichiers eux-mêmes sur un service de stockage

---

## 🚀 Étapes de déploiement rapide

1. **Préparez votre code :**
   ```bash
   npm run build
   git add .
   git commit -m "Ready for Render deployment"
   git push
   ```

2. **Sur Render Dashboard :**
   - New + → Web Service
   - Connectez votre repo
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Créez le service

3. **Attendez le déploiement** (5-10 minutes la première fois)

4. **Testez votre application** sur l'URL fournie par Render

---

## 🔐 Variables d'environnement importantes

Dans Render Dashboard → Environment :

- `NODE_ENV=production`
- `PORT=10000` (ou laissez Render le gérer)
- `FRONTEND_URL=https://votre-site.onrender.com` (si frontend séparé)

---

## ⚠️ Points d'attention

1. **Cold Start** : Sur le plan gratuit, le service s'endort après 15 min d'inactivité. Le premier appel peut prendre 30-60 secondes.

2. **Fichiers uploads** : Perdus lors des redémarrages sur le plan gratuit. Utilisez un service de stockage externe.

3. **Build Time** : Le build peut prendre 5-10 minutes. Soyez patient.

4. **Logs** : Consultez les logs dans Render Dashboard pour déboguer.

5. **HTTPS** : Render fournit automatiquement HTTPS avec un certificat SSL.

---

## 🐛 Dépannage

### Le build échoue
- Vérifiez les logs dans Render Dashboard
- Assurez-vous que `package.json` contient tous les scripts nécessaires
- Vérifiez que `node_modules` n'est pas dans le repo (ajoutez-le au `.gitignore`)

### L'application ne démarre pas
- Vérifiez que `startCommand` est correct : `npm start`
- Vérifiez les logs pour les erreurs
- Assurez-vous que le port est bien `process.env.PORT`

### Les uploads ne fonctionnent pas
- Vérifiez que le dossier `uploads/` est créé
- Sur Render, les fichiers sont éphémères (voir solutions ci-dessus)

### CORS errors
- Configurez CORS dans `server.js` pour autoriser votre domaine Render

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/node-version)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

## ✅ Checklist de déploiement

- [ ] Code poussé sur GitHub/GitLab
- [ ] `npm run build` fonctionne localement
- [ ] Service créé sur Render
- [ ] Build Command configuré : `npm install && npm run build`
- [ ] Start Command configuré : `npm start`
- [ ] Variables d'environnement ajoutées (si nécessaire)
- [ ] Application testée sur l'URL Render
- [ ] Solution pour les uploads configurée (si nécessaire)

---

**Bon déploiement ! 🎉**


