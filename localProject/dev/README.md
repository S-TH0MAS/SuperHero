# Super Hero Static - Application TypeScript

Application statique TypeScript qui reproduit les fonctionnalités du site PHP Symfony.

## 🚀 Installation

```bash
# Installer les dépendances
npm install
```

## 📋 Structure du projet

```
localProject/dev/
├── src/
│   ├── types/          # Types TypeScript (entités)
│   ├── services/       # Services (CSV reader, Data manager, Twig loader)
│   ├── pages/          # Pages de l'application
│   ├── router.ts       # Router côté client
│   ├── app.ts          # Point d'entrée
│   ├── index.html      # Template HTML principal
│   └── styles.scss     # Importe les styles SCSS du projet Symfony
├── data/               # Fichiers CSV (exportés depuis Symfony)
├── server/             # Serveur Express pour le dev
├── dist/               # Build final (généré)
└── package.json
```

## 🎨 Utilisation des templates Twig et SCSS Symfony

Le projet utilise **dynamiquement** les templates Twig et les fichiers SCSS du projet Symfony parent :

- **SCSS** : Les styles sont importés depuis `../../../assets/styles/app.scss` et compilés par Vite
- **Templates Twig** : Les templates sont dans le projet Symfony et peuvent être utilisés comme référence
- **Assets publics** : Les uploads sont servis depuis `../../public/uploads/` via Express

Cela permet de :
- ✅ Éviter la duplication de code
- ✅ Garder les styles synchronisés avec Symfony
- ✅ Développer avec les mêmes composants que Symfony

## 🛠️ Développement

### Mode développement avec serveur Express

```bash
# Terminal 1 : Vite dev server
npm run dev

# Terminal 2 : Serveur Express (pour servir les CSV)
npm run server

# OU les deux en même temps
npm run dev:full
```

L'application sera accessible sur `http://localhost:5173`

### Mode développement simple (sans Express)

Si vous servez les fichiers via un autre moyen (ex: Python http.server), vous pouvez utiliser uniquement :

```bash
npm run dev
```

## 🏗️ Build statique

Pour générer le build final (100% statique, sans serveur) :

```bash
npm run build
```

Le build sera généré dans le dossier `dist/` et pourra être déployé sur n'importe quel serveur statique (GitHub Pages, Netlify, etc.).

## 📊 Données

Les données sont chargées depuis les fichiers CSV dans le dossier `data/` :

- `super_hero.csv`
- `power.csv`
- `team.csv`
- `mission.csv`
- `super_hero_power.csv` (relations)
- `team_super_hero.csv` (relations)
- `mission_power.csv` (relations)

Pour mettre à jour les données, exécutez le script d'export depuis le projet Symfony :

```bash
php export-database.php
```

## 🎯 Fonctionnalités

- ✅ Dashboard avec statistiques
- ✅ Liste des héros avec filtres
- ✅ Détail d'un héros
- ✅ Liste des pouvoirs
- ✅ Détail d'un pouvoir
- ✅ Liste des équipes
- ✅ Détail d'une équipe
- ✅ Liste des missions
- ✅ Détail d'une mission
- ✅ Navigation SPA (Single Page Application)
- ✅ Router côté client

## 🔧 Scripts disponibles

- `npm run dev` - Démarre Vite en mode développement
- `npm run build` - Génère le build statique
- `npm run preview` - Prévisualise le build
- `npm run server` - Démarre le serveur Express
- `npm run dev:full` - Démarre Vite + Express en parallèle
- `npm run type-check` - Vérifie les types TypeScript

## 📝 Notes

- Le projet utilise Vite pour le bundling
- TypeScript pour le typage
- Router vanilla JS pour la navigation
- Les données sont chargées depuis CSV au démarrage
- Le build final est 100% statique (pas de serveur requis)

## 🚀 Déploiement

Le dossier `dist/` contient l'application statique complète. Vous pouvez :

1. **GitHub Pages** : Push le dossier `dist/`
2. **Netlify/Vercel** : Déployer depuis le repo
3. **Serveur web classique** : Copier `dist/` sur votre serveur

Pour le build statique, assurez-vous que les chemins vers les CSV sont relatifs (`./data/` au lieu de `/data/`).
