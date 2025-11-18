# Guide Complet - Super Hero Agency

## 📋 Vue d'ensemble

Ce guide vous accompagne pour créer le projet final **Super Hero Agency**, une application complète de gestion d'agence de super-héros utilisant Symfony 7.

## 🚀 Installation et Configuration

### 1. Créer le projet

```bash
# Créer le projet Symfony
symfony new super-hero-agency --webapp
cd super-hero-agency

# Installer les dépendances
composer require doctrine orm-fixtures fakerphp/faker
composer require form validator twig asset
composer require knplabs/knp-paginator-bundle
composer require symfony/string
```

### 2. Configuration de la base de données

```env
# .env.local
DATABASE_URL="mysql://root:@127.0.0.1:3306/super_hero_agency?serverVersion=8.0"
```

```bash
# Créer la base
symfony console doctrine:database:create
```

### 3. Configuration des uploads

Dans `config/services.yaml`, ajoutez :

```yaml
parameters:
    heroes_images_directory: '%kernel.project_dir%/public/uploads/heroes'
```

Créez le dossier :

```bash
mkdir -p public/uploads/heroes
```

## 📦 Entités Créées

Toutes les entités ont été créées avec leurs relations :

1. **SuperHero** : Héros avec pouvoirs, équipes, énergie
2. **Power** : Pouvoirs avec niveaux
3. **Team** : Équipes avec leader et membres
4. **Mission** : Missions avec statuts et équipes assignées

### Créer les migrations

```bash
# Générer la migration
symfony console make:migration

# Exécuter
symfony console doctrine:migrations:migrate
```

## 🎨 Fixtures - Données de Test

Les fixtures créent automatiquement :
- 15 pouvoirs variés
- 20 super-héros avec biographies
- 8 équipes avec leaders
- 15 missions avec différents statuts

```bash
# Charger les fixtures
symfony console doctrine:fixtures:load
```

## 🎯 Fonctionnalités Principales

### Dashboard (✅ Terminé)

**Fichiers créés :**
- `src/Controller/HomeController.php`
- `templates/home/index.html.twig`
- `templates/base.html.twig`

**Fonctionnalités :**
- Statistiques en temps réel
- Missions récentes
- Héros récents
- Actions rapides

### Super-Héros (✅ Terminé)

**Fichiers créés :**
- `src/Controller/SuperHeroController.php`
- `src/Form/SuperHeroType.php`
- `templates/super_hero/index.html.twig`
- `templates/super_hero/show.html.twig`
- `templates/super_hero/new.html.twig`
- `templates/super_hero/edit.html.twig`
- `templates/super_hero/_form.html.twig`

**Fonctionnalités :**
- Liste avec pagination et filtres
- Upload d'images
- Gestion des pouvoirs
- Niveau d'énergie
- Biographie complète

## 📝 Étapes Suivantes - À Compléter

### 1. CRUD Pouvoirs (Power)

```bash
symfony console make:crud Power
```

**Personnalisations à apporter :**

```php
// src/Form/PowerType.php
->add('level', RangeType::class, [
    'attr' => [
        'min' => 1,
        'max' => 5,
        'step' => 1,
    ],
    'label' => 'Niveau de puissance (1-5)',
])
```

**Template personnalisé** `templates/power/index.html.twig` :
- Afficher les étoiles pour le niveau
- Lister les héros possédant ce pouvoir
- Statistiques d'utilisation

### 2. CRUD Équipes (Team)

```bash
symfony console make:crud Team
```

**Formulaire personnalisé** `src/Form/TeamType.php` :

```php
->add('leader', EntityType::class, [
    'class' => SuperHero::class,
    'choice_label' => 'name',
    'query_builder' => function (SuperHeroRepository $repo) {
        return $repo->createQueryBuilder('sh')
            ->where('sh.energyLevel > 80')
            ->andWhere('sh.isAvailable = true')
            ->orderBy('sh.name', 'ASC');
    },
    'label' => 'Leader de l\'équipe',
])
->add('members', EntityType::class, [
    'class' => SuperHero::class,
    'choice_label' => 'name',
    'multiple' => true,
    'expanded' => false,
    'attr' => ['class' => 'form-select', 'size' => 10],
    'label' => 'Membres (2-5)',
])
```

**Validations personnalisées à ajouter :**

```php
// src/Validator/TeamMembersValidator.php
#[Assert\Callback]
public function validateMembers(ExecutionContextInterface $context): void
{
    if ($this->members->count() < 2 || $this->members->count() > 5) {
        $context->buildViolation('Une équipe doit avoir entre 2 et 5 membres')
            ->atPath('members')
            ->addViolation();
    }
    
    if ($this->leader && !$this->members->contains($this->leader)) {
        $this->members->add($this->leader);
    }
}
```

**Page de détail** `templates/team/show.html.twig` :
- Carte du leader avec badge
- Liste des membres avec leurs stats
- Missions en cours et historique
- Graphique des pouvoirs de l'équipe

### 3. CRUD Missions (Mission)

```bash
symfony console make:crud Mission
```

**Formulaire avancé** `src/Form/MissionType.php` :

```php
->add('status', ChoiceType::class, [
    'choices' => Mission::getStatusChoices(),
    'label' => 'Statut',
])
->add('startAt', DateTimeType::class, [
    'widget' => 'single_text',
    'label' => 'Date de début',
])
->add('endAt', DateTimeType::class, [
    'widget' => 'single_text',
    'required' => false,
    'label' => 'Date de fin',
])
->add('dangerLevel', RangeType::class, [
    'attr' => [
        'min' => 1,
        'max' => 5,
        'step' => 1,
    ],
    'label' => 'Niveau de danger',
])
->add('requiredPowers', EntityType::class, [
    'class' => Power::class,
    'choice_label' => 'name',
    'multiple' => true,
    'expanded' => true,
    'label' => 'Pouvoirs requis',
])
->add('assignedTeam', EntityType::class, [
    'class' => Team::class,
    'choice_label' => 'name',
    'query_builder' => function (TeamRepository $repo) {
        return $repo->createQueryBuilder('t')
            ->where('t.isActive = true')
            ->orderBy('t.name', 'ASC');
    },
    'required' => false,
    'label' => 'Équipe assignée',
])
```

**Validation avant assignation** :

```php
// src/Validator/MissionTeamValidator.php
#[Assert\Callback]
public function validateTeamHasPowers(ExecutionContextInterface $context): void
{
    if ($this->assignedTeam && !$this->requiredPowers->isEmpty()) {
        if (!$this->assignedTeam->hasAllPowers($this->requiredPowers->toArray())) {
            $context->buildViolation('L\'équipe ne possède pas tous les pouvoirs requis')
                ->atPath('assignedTeam')
                ->addViolation();
        }
    }
}
```

**Timeline des missions** `templates/mission/index.html.twig` :
- Vue calendrier
- Filtres par statut et niveau de danger
- Badges colorés selon le statut

### 4. Repositories Personnalisés

#### SuperHeroRepository

```php
// src/Repository/SuperHeroRepository.php
public function findAvailableForMission(): array
{
    return $this->createQueryBuilder('sh')
        ->where('sh.isAvailable = true')
        ->andWhere('sh.energyLevel >= :minEnergy')
        ->setParameter('minEnergy', 50)
        ->orderBy('sh.energyLevel', 'DESC')
        ->getQuery()
        ->getResult();
}

public function findTopHeroesByMissions(int $limit = 10): array
{
    return $this->createQueryBuilder('sh')
        ->leftJoin('sh.teams', 't')
        ->leftJoin('t.missions', 'm')
        ->select('sh', 'COUNT(m.id) as missionsCount')
        ->groupBy('sh.id')
        ->orderBy('missionsCount', 'DESC')
        ->setMaxResults($limit)
        ->getQuery()
        ->getResult();
}
```

#### TeamRepository

```php
// src/Repository/TeamRepository.php
public function findAvailableTeams(): array
{
    return $this->createQueryBuilder('t')
        ->where('t.isActive = true')
        ->andWhere('t.currentMission IS NULL')
        ->getQuery()
        ->getResult();
}

public function findWithSuccessRate(): array
{
    return $this->createQueryBuilder('t')
        ->leftJoin('t.missions', 'm')
        ->select('t', 
            'COUNT(m.id) as totalMissions',
            'SUM(CASE WHEN m.status = :completed THEN 1 ELSE 0 END) as completedMissions'
        )
        ->setParameter('completed', Mission::STATUS_COMPLETED)
        ->groupBy('t.id')
        ->getQuery()
        ->getResult();
}
```

#### MissionRepository

```php
// src/Repository/MissionRepository.php
public function findUpcoming(): array
{
    return $this->createQueryBuilder('m')
        ->where('m.startAt > :now')
        ->andWhere('m.status = :pending')
        ->setParameter('now', new \DateTime())
        ->setParameter('pending', Mission::STATUS_PENDING)
        ->orderBy('m.startAt', 'ASC')
        ->getQuery()
        ->getResult();
}

public function findByDateRange(\DateTime $start, \DateTime $end): array
{
    return $this->createQueryBuilder('m')
        ->where('m.startAt BETWEEN :start AND :end')
        ->setParameter('start', $start)
        ->setParameter('end', $end)
        ->orderBy('m.startAt', 'ASC')
        ->getQuery()
        ->getResult();
}
```

## 🎨 Améliorations Visuelles

### 1. Thème Sombre/Clair

Ajoutez dans `base.html.twig` avant `</head>` :

```html
<script>
    // Gestion du thème
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-outline-light position-fixed bottom-0 end-0 m-3';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.onclick = () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.className = document.body.classList.contains('dark-theme') 
            ? 'fas fa-sun' 
            : 'fas fa-moon';
    };
    document.body.appendChild(themeToggle);
</script>
```

### 2. Animations CSS

```css
/* Dans le style de base.html.twig */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.list-group-item {
    animation: slideIn 0.3s ease-out;
}

.card:hover {
    transform: translateY(-10px) scale(1.02);
    transition: all 0.3s ease;
}
```

## 📊 Dashboard Avancé

### Statistiques Avancées

Créez `src/Service/StatisticsService.php` :

```php
namespace App\Service;

use App\Repository\MissionRepository;
use App\Repository\SuperHeroRepository;
use App\Repository\TeamRepository;

class StatisticsService
{
    public function __construct(
        private SuperHeroRepository $heroRepo,
        private TeamRepository $teamRepo,
        private MissionRepository $missionRepo
    ) {}

    public function getDashboardStats(): array
    {
        return [
            'heroes' => $this->getHeroStats(),
            'teams' => $this->getTeamStats(),
            'missions' => $this->getMissionStats(),
        ];
    }

    private function getHeroStats(): array
    {
        $total = $this->heroRepo->count([]);
        $available = $this->heroRepo->count(['isAvailable' => true]);
        
        return [
            'total' => $total,
            'available' => $available,
            'availability_rate' => $total > 0 ? round(($available / $total) * 100) : 0,
        ];
    }

    private function getTeamStats(): array
    {
        $teams = $this->teamRepo->findWithSuccessRate();
        $successRates = [];
        
        foreach ($teams as $data) {
            $total = $data['totalMissions'];
            $completed = $data['completedMissions'];
            if ($total > 0) {
                $successRates[] = ($completed / $total) * 100;
            }
        }
        
        return [
            'total' => count($teams),
            'average_success_rate' => !empty($successRates) ? round(array_sum($successRates) / count($successRates)) : 0,
        ];
    }

    private function getMissionStats(): array
    {
        return [
            'pending' => $this->missionRepo->count(['status' => 'PENDING']),
            'in_progress' => $this->missionRepo->count(['status' => 'IN_PROGRESS']),
            'completed' => $this->missionRepo->count(['status' => 'COMPLETED']),
            'failed' => $this->missionRepo->count(['status' => 'FAILED']),
        ];
    }
}
```

## 🔍 Fonctionnalités Bonus

### 1. Recherche Globale

Créez `src/Controller/SearchController.php` :

```php
#[Route('/search', name: 'app_search')]
public function search(
    Request $request,
    SuperHeroRepository $heroRepo,
    TeamRepository $teamRepo,
    MissionRepository $missionRepo
): Response {
    $query = $request->query->get('q');
    
    $results = [
        'heroes' => $heroRepo->search($query),
        'teams' => $teamRepo->search($query),
        'missions' => $missionRepo->search($query),
    ];
    
    return $this->render('search/results.html.twig', [
        'query' => $query,
        'results' => $results,
    ]);
}
```

### 2. Export PDF

```bash
composer require knplabs/knp-snappy-bundle
composer require h4cc/wkhtmltopdf-amd64
```

### 3. API REST

```bash
composer require api
```

Créez des endpoints API pour :
- Liste des héros disponibles
- Statistiques en JSON
- Calendrier des missions

### 4. Notifications en Temps Réel

```bash
composer require symfony/mercure-bundle
```

## ✅ Checklist Finale

### Fonctionnalités
- [x] Dashboard avec statistiques
- [x] CRUD Super-Héros complet
- [x] Upload d'images
- [x] Pagination
- [ ] CRUD Pouvoirs
- [ ] CRUD Équipes avec validation
- [ ] CRUD Missions avec contraintes
- [ ] Repositories personnalisés
- [ ] Statistiques avancées

### Interface
- [x] Design responsive
- [x] Bootstrap 5
- [x] Animations CSS
- [x] Messages flash
- [ ] Thème sombre/clair
- [ ] Icônes Font Awesome partout

### Technique
- [x] Entités avec relations
- [x] Fixtures complètes
- [x] Migrations
- [x] Formulaires validés
- [ ] Tests unitaires
- [ ] Tests fonctionnels

### Bonus
- [ ] Recherche globale
- [ ] Export PDF
- [ ] API REST
- [ ] WebSocket notifications

## 🚀 Lancement du Projet

```bash
# Démarrer le serveur
symfony serve

# Ouvrir dans le navigateur
# http://localhost:8000
```

## 📚 Ressources

- [Documentation Symfony](https://symfony.com/doc/current/index.html)
- [Doctrine ORM](https://www.doctrine-project.org/projects/doctrine-orm/en/latest/index.html)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Font Awesome](https://fontawesome.com/icons)

## 🎓 Points d'Apprentissage

Ce projet met en pratique :
1. Architecture MVC
2. Doctrine ORM et relations complexes
3. Formulaires Symfony avancés
4. Validation des données
5. Upload de fichiers
6. Pagination
7. Fixtures et Faker
8. Services métier
9. Repositories personnalisés
10. Design responsive avec Bootstrap

---

**Bon courage pour la réalisation du projet ! 🦸‍♂️🦸‍♀️**
