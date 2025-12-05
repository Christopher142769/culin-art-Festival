# 🌐 Guide : Déploiement avec Static Service sur Render

## 📊 Comparaison des options

### Option 1 : Web Service (actuel)
- ✅ **Avantages** : Tout en un seul service, simple
- ❌ **Inconvénients** : Plus cher, serveur Node.js toujours actif

### Option 2 : Static Site + Web Service (Recommandé)
- ✅ **Avantages** : Frontend gratuit, backend séparé, meilleure performance
- ❌ **Inconvénients** : Deux services à gérer

### Option 3 : Static Site uniquement (Sans backend)
- ✅ **Avantages** : Totalement gratuit
- ❌ **Inconvénients** : Pas d'upload de templates/logo (nécessite Cloudinary/S3)

---

## 🎯 Option recommandée : Static Site + Web Service

Cette configuration sépare le frontend (gratuit) du backend (gratuit aussi sur plan free).

### Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Static Site    │  ────►  │  Web Service    │
│  (Frontend)     │  API    │  (Backend API)  │
│  Gratuit        │         │  Gratuit        │
└─────────────────┘         └─────────────────┘
```

---

## 🚀 Étape 1 : Déployer le Backend (Web Service)

### 1.1 Créer le service backend

1. **Sur Render Dashboard** → "New +" → "Web Service"

2. **Configuration :**
   - **Name** : `culinart-backend` (ou votre choix)
   - **Repository** : Votre repo GitHub
   - **Root Directory** : Laissez vide (racine)
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Instance Type** : `Free`

3. **Variables d'environnement :**
   - `NODE_ENV=production`
   - `PORT=10000` (Render le définit automatiquement, mais on peut le spécifier)
   - `FRONTEND_URL=https://votre-frontend.onrender.com` (à définir après le déploiement du frontend)

4. **Cliquez sur "Create Web Service"**

5. **Notez l'URL du backend** : `https://culinart-backend.onrender.com` (exemple)

### 1.2 Modifier server.js pour CORS

Assurez-vous que `server.js` autorise les requêtes depuis votre frontend :

```javascript
// Dans server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // En production, spécifiez l'URL exacte
  credentials: true
}
app.use(cors(corsOptions))
```

---

## 🎨 Étape 2 : Déployer le Frontend (Static Site)

### 2.1 Modifier l'URL de l'API dans le frontend

Avant de déployer, vous devez configurer l'URL de l'API backend.

**Option A : Variable d'environnement (Recommandé)**

1. **Créer un fichier `.env.production`** :
```bash
VITE_API_URL=https://culinart-backend.onrender.com
```

2. **Modifier `vite.config.js`** pour utiliser cette variable :
```javascript
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001')
  }
})
```

3. **Modifier `src/services/api.js`** :
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const getTemplate = async () => {
  const response = await fetch(`${API_BASE_URL}/api/template`)
  // ...
}
```

**Option B : Configuration directe**

Modifiez directement `src/services/api.js` :

```javascript
// Pour production
const API_BASE_URL = 'https://culinart-backend.onrender.com'

// Pour développement local
// const API_BASE_URL = 'http://localhost:3001'
```

### 2.2 Créer le Static Site sur Render

1. **Sur Render Dashboard** → "New +" → "Static Site"

2. **Configuration :**
   - **Name** : `culinart-festival` (ou votre choix)
   - **Repository** : Votre repo GitHub
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
   - **Environment** : Ajoutez la variable :
     - `VITE_API_URL=https://culinart-backend.onrender.com`

3. **Cliquez sur "Create Static Site"**

4. **Notez l'URL du frontend** : `https://culinart-festival.onrender.com` (exemple)

### 2.3 Mettre à jour le backend avec l'URL du frontend

1. **Retournez sur le Web Service backend**
2. **Environment Variables** → Ajoutez/modifiez :
   - `FRONTEND_URL=https://culinart-festival.onrender.com`
3. **Redeploy** le backend pour appliquer les changements

---

## 🔧 Configuration détaillée

### Fichier `src/services/api.js` modifié

```javascript
// Configuration de l'URL de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     import.meta.env.MODE === 'production' 
                       ? 'https://culinart-backend.onrender.com'
                       : 'http://localhost:3001'

export const getTemplate = async () => {
  const response = await fetch(`${API_BASE_URL}/api/template`)
  if (!response.ok) throw new Error('Failed to fetch template')
  return await response.json()
}

export const uploadTemplate = async (file) => {
  const formData = new FormData()
  formData.append('template', file)
  
  const response = await fetch(`${API_BASE_URL}/api/template`, {
    method: 'POST',
    body: formData
  })
  if (!response.ok) throw new Error('Failed to upload template')
  return await response.json()
}

export const getLogo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/logo`)
  if (!response.ok) throw new Error('Failed to fetch logo')
  return await response.json()
}

export const uploadLogo = async (file) => {
  const formData = new FormData()
  formData.append('logo', file)
  
  const response = await fetch(`${API_BASE_URL}/api/logo`, {
    method: 'POST',
    body: formData
  })
  if (!response.ok) throw new Error('Failed to upload logo')
  return await response.json()
}
```

### Fichier `vite.config.js` modifié

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Pour la production, les variables d'environnement sont injectées automatiquement
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})
```

---

## 📝 Fichier render.yaml pour les deux services

```yaml
services:
  # Backend API
  - type: web
    name: culinart-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: FRONTEND_URL
        sync: false  # À définir manuellement après déploiement du frontend

  # Frontend Static Site
  - type: web
    name: culinart-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        sync: false  # À définir avec l'URL du backend
```

**Note** : Render ne supporte pas encore les Static Sites dans `render.yaml`, donc créez-le manuellement.

---

## ✅ Avantages de cette configuration

1. **Frontend gratuit** : Static Site est toujours gratuit
2. **Backend gratuit** : Web Service free tier disponible
3. **Meilleure performance** : CDN pour le frontend
4. **Séparation des concerns** : Frontend et backend indépendants
5. **Scalabilité** : Facile d'ajouter plus de services backend si besoin

---

## ⚠️ Points d'attention

1. **CORS** : Assurez-vous que le backend autorise les requêtes depuis le frontend
2. **URLs** : Configurez correctement les URLs dans les variables d'environnement
3. **Cold Start** : Le backend peut prendre 30-60 secondes au premier appel (plan free)
4. **Fichiers uploads** : Toujours éphémères sur le plan free (voir solutions dans le guide principal)

---

## 🔄 Workflow de déploiement

1. **Déployer le backend** → Noter l'URL
2. **Configurer le frontend** avec l'URL du backend
3. **Déployer le frontend** → Noter l'URL
4. **Mettre à jour le backend** avec l'URL du frontend (pour CORS)
5. **Tester** les deux services

---

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement défini dans le backend
- Vérifiez que `corsOptions` dans `server.js` autorise votre domaine

### API ne répond pas
- Vérifiez que l'URL du backend est correcte dans le frontend
- Vérifiez les logs du backend sur Render Dashboard
- Attendez le cold start (30-60 secondes)

### Build échoue
- Vérifiez que `npm run build` fonctionne localement
- Vérifiez les logs de build sur Render Dashboard

---

## 💰 Coûts

- **Static Site** : Gratuit (illimité)
- **Web Service (Free)** : Gratuit (avec limitations : cold start, fichiers éphémères)
- **Total** : 0€/mois pour commencer

---

**Cette configuration est recommandée pour la production ! 🚀**

