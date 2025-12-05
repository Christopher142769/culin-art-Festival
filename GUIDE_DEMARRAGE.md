# 🚀 Guide de Démarrage Complet

## ⚠️ IMPORTANT : L'application nécessite 2 serveurs

1. **Backend** (port 3001) - API pour templates et logo
2. **Frontend** (port 3000) - Interface React

## 📋 Démarrage Rapide

### Option 1 : Tout démarrer en une commande (RECOMMANDÉ)
```bash
npm run dev:all
```
Cela démarre automatiquement :
- Backend sur http://localhost:3001
- Frontend sur http://localhost:3000

### Option 2 : Démarrer séparément

**Terminal 1 - Backend :**
```bash
npm run dev:server:clean
```

**Terminal 2 - Frontend :**
```bash
npm run dev
```

## ✅ Vérification

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Le logo devrait s'afficher dans la navbar (si uploadé)
3. Les templates devraient se charger depuis le serveur

## 🔧 Problèmes Courants

### "Port 3001 already in use"
```bash
npm run kill-port
npm run dev:server
```

### "API not available"
- Vérifiez que le backend est démarré : `npm run dev:server`
- Vérifiez les logs dans le terminal du backend

### Le logo ne s'affiche pas
- Vérifiez que vous avez uploadé un logo dans le dashboard
- Vérifiez la console du navigateur (F12) pour les erreurs
- Vérifiez que le serveur backend est démarré

### Les templates ne se chargent pas
- Vérifiez que vous avez uploadé un template dans le dashboard
- Vérifiez que le fichier existe dans `uploads/active-template.json`
- Vérifiez les logs du serveur backend

## 🧪 Tester l'API

```bash
# Tester le logo
curl http://localhost:3001/api/logo

# Tester le template
curl http://localhost:3001/api/template
```

## 📁 Structure des Fichiers

```
uploads/
  ├── active-template.json  (template actif)
  ├── logo.json             (logo du festival)
  └── [fichiers images]     (templates et logos uploadés)
```

## 🌐 Production

```bash
npm run build
npm start
```

Le serveur servira automatiquement le frontend buildé sur le port configuré.


