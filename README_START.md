# 🚀 Guide de Démarrage

## ⚠️ IMPORTANT : Démarrage du Backend

Pour que vos modifications (logo, templates) soient **partagées entre tous les navigateurs**, vous devez démarrer le **backend serveur**.

### Démarrage en Développement

**Option 1 : Démarrer les deux en même temps (recommandé)**
```bash
npm run dev:all
```
Cela démarre :
- Le backend sur `http://localhost:3001`
- Le frontend sur `http://localhost:3000`

**Option 2 : Démarrer séparément**

Terminal 1 - Backend :
```bash
npm run dev:server
```

Terminal 2 - Frontend :
```bash
npm run dev
```

### Démarrage en Production

```bash
npm run build
npm start
```

## ✅ Comment ça fonctionne maintenant

1. **Tous les uploads** (logo, templates) sont stockés sur le **serveur**
2. **Tous les navigateurs** chargent depuis le **même serveur**
3. **Vos modifications** sont **visibles partout** :
   - Chrome, Firefox, Safari, Edge
   - Mobile, tablette, desktop
   - Tous les visiteurs

## 🔧 Si le serveur n'est pas démarré

- Le logo ne s'affichera pas dans la navbar
- Les templates ne se chargeront pas
- Vous verrez des erreurs dans la console

**Solution** : Démarrez le serveur avec `npm run dev:server` ou `npm run dev:all`

## 📁 Structure

- `server.js` - Backend Express (port 3001)
- `src/` - Frontend React (port 3000)
- `uploads/` - Fichiers uploadés (templates, logos)

## 🌐 Déploiement sur Render

Le serveur démarre automatiquement avec `npm start` après le build.

