# 📁 Dossier Vidéos

Placez votre vidéo ici !

## 📝 Instructions

1. **Copiez votre fichier vidéo** dans ce dossier (`public/videos/`)

2. **Ouvrez** `src/components/VideoBackground.jsx`

3. **Modifiez la ligne 18** :
   ```javascript
   const VIDEO_URL = '/videos/votre-fichier.mp4'
   ```
   Remplacez `votre-fichier.mp4` par le nom réel de votre fichier.

## ✅ Exemple

Si votre fichier s'appelle `grillades-culinart.mp4`, la ligne sera :
```javascript
const VIDEO_URL = '/videos/grillades-culinart.mp4'
```

## 🎬 Formats supportés

- `.mp4` (recommandé)
- `.webm`
- `.ogg`

## ⚠️ Important

- Le chemin commence par `/videos/` (pas `public/videos/`)
- Vite sert automatiquement les fichiers du dossier `public/`
- Après avoir ajouté votre vidéo, redémarrez le serveur de développement

