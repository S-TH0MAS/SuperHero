# Structure JavaScript - Géré par Webpack Encore

Tout le JavaScript de l'application est compilé et géré par **Webpack Encore**.

## Structure

```
assets/
├── app.js                    # Point d'entrée principal (compilé par Webpack Encore)
├── controllers/
│   └── csrf_protection.js   # Protection CSRF pour Symfony
└── styles/
    └── app.css              # Styles CSS (importés dans app.js)
```

## Point d'entrée : `app.js`

Le fichier `app.js` est le point d'entrée unique. Il importe :

1. **CSS** : `./styles/app.css`
2. **Bibliothèques externes** :
   - `bootstrap` : Framework CSS/JS
   - `@hotwired/turbo` : Navigation SPA
   - `@hotwired/stimulus` : Framework JavaScript réactif
3. **Modules personnalisés** :
   - `./controllers/csrf_protection.js` : Protection CSRF

## Compilation

### Développement
```bash
npm run dev
# ou pour le watch mode
npm run watch
```
- Compilation des assets dans `public/build/`
- Source maps activées
- Rechargement automatique des modifications (en mode watch)

### Production
```bash
npm run build
```
- Assets compilés dans `public/build/`
- JavaScript minifié et optimisé
- CSS optimisé
- Versioning automatique des fichiers

## Ajouter du code JavaScript

### Option 1 : Directement dans `app.js`

Pour du code simple, ajoutez-le dans `app.js` :

```javascript
// Dans assets/app.js
function maFonction() {
    // Votre code
}
```

### Option 2 : Créer un module séparé

Pour du code plus complexe, créez un nouveau fichier :

```javascript
// assets/utils/helpers.js
export function helperFunction() {
    // Votre code
}
```

Puis importez-le dans `app.js` :

```javascript
// Dans assets/app.js
import { helperFunction } from './utils/helpers.js';
```

## Contrôleurs Stimulus

Si vous avez besoin de contrôleurs Stimulus :

1. Créez un fichier dans `assets/controllers/` :
```javascript
// assets/controllers/mon_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        // Code du contrôleur
    }
}
```

2. Enregistrez-le dans `app.js` :
```javascript
// Dans assets/app.js
import MonController from './controllers/mon_controller.js';
app.register('mon-controller', MonController);
```

3. Utilisez-le dans vos templates :
```twig
<div data-controller="mon-controller">
    <!-- Contenu -->
</div>
```

## Bonnes pratiques

- ✅ Tout le JavaScript passe par `app.js`
- ✅ Utilisez des modules ES6 (`import`/`export`)
- ✅ Organisez le code en fonctions nommées
- ✅ Documentez vos fonctions avec des commentaires JSDoc
- ✅ Évitez le code inline dans les templates
- ✅ Utilisez Webpack Encore pour toutes les dépendances npm

## Dépendances npm

Pour ajouter une dépendance :

```bash
npm install nom-de-la-bibliotheque
```

Puis importez-la dans `app.js` :

```javascript
import nomDeLaBibliotheque from 'nom-de-la-bibliotheque';
```

