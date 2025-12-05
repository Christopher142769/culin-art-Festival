# Culin'Art Festival - Générateur d'Affiches Personnalisées

Une application web moderne et interactive permettant aux visiteurs de créer des affiches personnalisées en uploadant leurs photos.

## 🎨 Fonctionnalités

- **Upload de Photos** : Glissez-déposez ou sélectionnez vos photos
- **Affiches Personnalisées** : Superposition automatique de votre photo sur un template d'affiche
- **Dashboard Admin** : Gérez vos templates d'affiches depuis le dashboard
- **Téléchargement** : Téléchargez votre affiche personnalisée en haute qualité
- **Effets Parallaxe** : Design moderne avec effets visuels impressionnants
- **Charte Graphique** : Inspirée du logo Culin'Art Festival (teal, orange, rouge, or)

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📖 Utilisation

### Pour les Visiteurs

1. Accédez à la page d'accueil
2. Glissez-déposez votre photo ou cliquez pour sélectionner
3. Votre affiche personnalisée apparaît automatiquement
4. Cliquez sur "Télécharger l'Affiche" pour sauvegarder

### Pour les Administrateurs

1. Accédez au Dashboard
2. Uploader un nouveau template d'affiche ou créer un template par défaut
3. Sélectionnez le template actif
4. Les visiteurs verront automatiquement le nouveau template

## 🎨 Charte Graphique

- **Teal** : `#1a5f5f`
- **Orange** : `#ff6b35`
- **Rouge** : `#8b2635`
- **Or** : `#d4af37`
- **Blanc** : `#ffffff`

## 🛠️ Technologies

- React 18
- Vite
- Framer Motion (animations)
- React Router (routing)
- Canvas API (génération d'images)

## 📝 Notes

Les templates sont stockés dans le localStorage du navigateur. Pour une utilisation en production, il est recommandé d'utiliser un backend pour stocker les templates et les images.

