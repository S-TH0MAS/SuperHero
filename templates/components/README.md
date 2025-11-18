# Architecture des Composants Twig

Ce dossier contient des composants réutilisables pour améliorer la maintenabilité du code.

## Structure

```
templates/
├── components/
│   ├── _page_header.html.twig      # En-tête de page réutilisable
│   ├── _action_buttons.html.twig   # Boutons d'action (Voir/Modifier/Supprimer)
│   ├── _empty_state.html.twig      # État vide avec message
│   ├── _hero_card.html.twig         # Carte de super-héros
│   ├── _power_card.html.twig        # Carte de pouvoir
│   ├── _team_card.html.twig         # Carte d'équipe
│   ├── _mission_card.html.twig      # Carte de mission
│   └── _danger_zone.html.twig       # Zone de danger pour suppressions
```

## Composants disponibles

### `_page_header.html.twig`
En-tête de page standardisé avec titre, sous-titre, icône et actions.

**Paramètres:**
- `title` (requis): Titre de la page
- `subtitle` (optionnel): Sous-titre
- `icon` (optionnel): Icône Font Awesome
- `actions` (optionnel): Tableau d'actions à afficher

**Exemple:**
```twig
{{ include('components/_page_header.html.twig', {
    'title': 'Super-Héros',
    'subtitle': 'Gestion des agents',
    'icon': 'fas fa-mask',
    'actions': [{
        'url': path('super_hero_new'),
        'label': 'Nouveau',
        'icon': 'fas fa-plus',
        'class': 'btn-primary'
    }]
}) }}
```

### `_action_buttons.html.twig`
Boutons d'action standardisés (Voir/Modifier/Supprimer).

**Paramètres:**
- `show_url` (optionnel): URL pour "Voir"
- `edit_url` (optionnel): URL pour "Modifier"
- `delete_url` (optionnel): URL pour "Supprimer"
- `size` (optionnel): Taille des boutons (défaut: "btn-sm")

**Exemple:**
```twig
{{ include('components/_action_buttons.html.twig', {
    'show_url': path('super_hero_show', {'id': hero.id}),
    'edit_url': path('super_hero_edit', {'id': hero.id})
}) }}
```

### `_empty_state.html.twig`
Message d'état vide avec icône et bouton d'action.

**Paramètres:**
- `icon` (requis): Icône Font Awesome
- `title` (requis): Titre du message
- `message` (optionnel): Message descriptif
- `action_url` (optionnel): URL pour le bouton
- `action_label` (optionnel): Label du bouton

**Exemple:**
```twig
{{ include('components/_empty_state.html.twig', {
    'icon': 'fas fa-info-circle',
    'title': 'Aucun héros trouvé',
    'message': 'Commencez par ajouter votre premier super-héros !',
    'action_url': path('super_hero_new'),
    'action_label': 'Ajouter un Héros'
}) }}
```

### `_hero_card.html.twig`
Carte de super-héros avec image, informations et actions.

**Paramètres:**
- `hero` (requis): Objet SuperHero
- `show_actions` (optionnel): Afficher les boutons (défaut: true)

**Exemple:**
```twig
{{ include('components/_hero_card.html.twig', {'hero': hero}) }}
```

### `_power_card.html.twig`
Carte de pouvoir avec informations et actions.

**Paramètres:**
- `power` (requis): Objet Power
- `show_actions` (optionnel): Afficher les boutons (défaut: true)

### `_team_card.html.twig`
Carte d'équipe avec informations et actions.

**Paramètres:**
- `team` (requis): Objet Team
- `show_actions` (optionnel): Afficher les boutons (défaut: true)

### `_mission_card.html.twig`
Carte de mission avec informations et actions.

**Paramètres:**
- `mission` (requis): Objet Mission
- `show_actions` (optionnel): Afficher les boutons (défaut: true)

### `_danger_zone.html.twig`
Zone de danger pour les suppressions avec formulaire.

**Paramètres:**
- `title` (optionnel): Titre de la zone
- `message` (optionnel): Message d'avertissement
- `delete_form` (requis): Chemin vers le template de formulaire
- `delete_form_vars` (optionnel): Variables pour le formulaire

**Exemple:**
```twig
{{ include('components/_danger_zone.html.twig', {
    'message': 'La suppression est irréversible.',
    'delete_form': 'super_hero/_delete_form.html.twig',
    'delete_form_vars': {'super_hero': super_hero}
}) }}
```

## Avantages

1. **Réutilisabilité**: Code DRY (Don't Repeat Yourself)
2. **Maintenabilité**: Modifications centralisées
3. **Cohérence**: Interface utilisateur uniforme
4. **Lisibilité**: Templates plus courts et clairs
5. **Testabilité**: Composants isolés plus faciles à tester

## Bonnes pratiques

- Toujours utiliser les composants plutôt que de dupliquer le code
- Documenter les nouveaux composants dans ce README
- Garder les composants simples et focalisés sur une seule responsabilité
- Utiliser des paramètres avec valeurs par défaut pour la flexibilité

