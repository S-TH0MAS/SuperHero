# Structure SCSS

Tous les styles CSS sont organisés en composants SCSS modulaires pour une meilleure maintenabilité.

## Structure des fichiers

```
assets/styles/
├── app.scss                    # Fichier principal qui importe tous les composants
├── base/                       # Styles de base
│   ├── _variables.scss        # Variables CSS personnalisées
│   └── _base.scss             # Styles de base (body, etc.)
├── layout/                     # Styles de mise en page
│   ├── _navbar.scss          # Barre de navigation
│   ├── _container.scss       # Conteneur principal
│   ├── _footer.scss          # Pied de page
│   └── _page-header.scss     # En-tête de page
└── components/                 # Composants réutilisables
    ├── _cards.scss           # Styles des cartes
    ├── _buttons.scss         # Styles des boutons
    ├── _energy-bar.scss      # Barre d'énergie
    ├── _pagination.scss      # Pagination
    └── _animations.scss      # Animations
```

## Utilisation

Le fichier `app.scss` importe automatiquement tous les composants. Il est compilé par Webpack Encore et génère `public/build/app.css`.

**Note :** Ce projet utilise la syntaxe moderne SCSS `@use` au lieu de `@import` (déprécié).

### Ajouter un nouveau composant

1. Créez un fichier dans le dossier approprié :
   ```scss
   // assets/styles/components/_mon-composant.scss
   .mon-composant {
       // Vos styles
   }
   ```

2. Importez-le dans `app.scss` avec `@use` :
   ```scss
   @use 'components/mon-composant';
   ```

3. Recompilez :
   ```bash
   npm run dev
   ```

## Variables

Les variables CSS sont définies dans `base/_variables.scss` :

```scss
:root {
    --primary-color: #1a237e;
    --secondary-color: #c62828;
    --success-color: #2e7d32;
    --warning-color: #f57c00;
}
```

Utilisez-les dans vos composants :

```scss
.mon-composant {
    color: var(--primary-color);
}
```

## Bonnes pratiques

- ✅ Un fichier par composant
- ✅ Utilisez les variables CSS pour les couleurs
- ✅ Utilisez les sélecteurs SCSS (imbrication, &, etc.)
- ✅ Organisez les fichiers par fonctionnalité (base, layout, components)
- ✅ Préfixez les fichiers partiels avec `_` (ex: `_cards.scss`)

