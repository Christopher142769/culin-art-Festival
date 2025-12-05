# 🎥 Configuration de la Vidéo Background

## 📍 Où placer votre vidéo locale

### Étape 1 : Créer le dossier (déjà fait ✅)
Le dossier `public/videos/` existe déjà.

### Étape 2 : Copier votre vidéo
Copiez votre fichier vidéo dans :
```
/home/valentino/photo1/public/videos/
```

### Étape 3 : Modifier le code
Ouvrez le fichier : **`src/components/VideoBackground.jsx`**

**Ligne 18**, remplacez :
```javascript
const VIDEO_URL = '/videos/votre-video.mp4'
```

Par le nom réel de votre fichier, par exemple :
```javascript
const VIDEO_URL = '/videos/grillades-culinart.mp4'
```

## 📂 Structure des fichiers

```
photo1/
├── public/
│   └── videos/
│       ├── votre-video.mp4  ← Placez votre vidéo ici
│       └── README.md
└── src/
    └── components/
        └── VideoBackground.jsx  ← Modifiez la ligne 18 ici
```

## ✅ Exemples

### Vidéo locale
```javascript
const VIDEO_URL = '/videos/grillades.mp4'
```

### Vidéo en ligne
```javascript
const VIDEO_URL = 'https://cdn.votre-site.com/videos/grillades.mp4'
```

## 🎬 Formats recommandés

- **MP4 (H.264)** : Meilleure compatibilité
- **WebM** : Bonne compression
- **Résolution** : 1920x1080 (Full HD) ou plus
- **Taille** : Optimisez votre vidéo (10-20MB max recommandé)

## ⚠️ Important

1. **Le chemin commence par `/videos/`** (pas `public/videos/`)
2. **Vite sert automatiquement** les fichiers du dossier `public/`
3. **Redémarrez le serveur** après avoir ajouté votre vidéo :
   ```bash
   npm run dev:all
   ```

## 🔍 Vérification

Pour vérifier que votre vidéo est bien accessible :
1. Démarrez le serveur : `npm run dev:all`
2. Ouvrez : `http://localhost:3000/videos/votre-video.mp4`
3. Si la vidéo s'affiche, c'est bon !
