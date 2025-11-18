<?php
// src/DataFixtures/AppFixtures.php
namespace App\DataFixtures;

use App\Entity\Mission;
use App\Entity\Power;
use App\Entity\SuperHero;
use App\Entity\Team;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // Création des pouvoirs
        $powers = [];
        $powersList = [
            ['Super Force', 'Force surhumaine permettant de soulever plusieurs tonnes', 5],
            ['Vol', 'Capacité de voler à grande vitesse', 4],
            ['Télékinésie', 'Manipulation mentale des objets', 5],
            ['Invisibilité', 'Capacité de devenir invisible', 3],
            ['Vitesse', 'Déplacement à vitesse supersonique', 4],
            ['Régénération', 'Guérison accélérée des blessures', 4],
            ['Télépathie', 'Lecture et communication mentale', 5],
            ['Contrôle du Feu', 'Manipulation et création de flammes', 4],
            ['Contrôle de la Glace', 'Manipulation et création de glace', 4],
            ['Électricité', 'Génération et contrôle de l\'électricité', 4],
            ['Super Intelligence', 'Intelligence et calcul surhumains', 3],
            ['Transformation', 'Capacité de changer d\'apparence', 3],
            ['Vision Laser', 'Émission de rayons d\'énergie', 4],
            ['Super Ouïe', 'Audition exceptionnelle', 2],
            ['Agilité', 'Réflexes et agilité surhumains', 3],
        ];

        foreach ($powersList as [$name, $description, $level]) {
            $power = new Power();
            $power->setName($name)
                ->setDescription($description)
                ->setLevel($level);

            $manager->persist($power);
            $powers[] = $power;
        }

        // Création des super-héros
        $heroes = [];
        $heroNames = [
            ['Captain Cosmos', 'Steve Rogers'],
            ['Iron Defender', 'Tony Stark'],
            ['Thunder God', 'Thor Odinson'],
            ['Shadow Widow', 'Natasha Romanoff'],
            ['Phoenix Force', 'Jean Grey'],
            ['Speed Demon', 'Barry Allen'],
            ['Mystic Mind', 'Charles Xavier'],
            ['Flame Master', 'Johnny Storm'],
            ['Ice Queen', 'Emma Frost'],
            ['Electric Storm', 'Ororo Munroe'],
            ['Quantum Leap', 'Hank Pym'],
            ['Morpheus', 'Raven Darkholme'],
            ['Laser Eye', 'Scott Summers'],
            ['Sonic Sense', 'Matt Murdock'],
            ['Night Crawler', 'Kurt Wagner'],
            ['Silver Surfer', 'Norrin Radd'],
            ['Dark Phoenix', 'Rachel Summers'],
            ['Blaze Runner', 'Johnny Blaze'],
            ['Crystal Guardian', 'Bobby Drake'],
            ['Voltage', 'Max Dillon'],
        ];

        foreach ($heroNames as $index => [$name, $alterEgo]) {
            $hero = new SuperHero();
            $hero->setName($name)
                ->setAlterEgo($alterEgo)
                ->setIsAvailable($faker->boolean(70))
                ->setEnergyLevel($faker->numberBetween(50, 100))
                ->setBiography($faker->paragraphs(3, true))
                ->setImageName(null);

            // Assigner 2-4 pouvoirs aléatoires
            $heroPowers = $faker->randomElements($powers, $faker->numberBetween(2, 4));
            foreach ($heroPowers as $power) {
                $hero->addPower($power);
            }

            $manager->persist($hero);
            $heroes[] = $hero;
        }

        // Création des équipes
        $teams = [];
        $teamNames = [
            'Avengers',
            'X-Men',
            'Fantastic Four',
            'Justice League',
            'Guardians',
            'Defenders',
            'Teen Titans',
            'Eternals'
        ];

        foreach ($teamNames as $teamName) {
            // Sélectionner un leader avec énergie > 80
            $eligibleLeaders = array_filter($heroes, fn($h) => $h->getEnergyLevel() > 80);
            if (empty($eligibleLeaders)) {
                continue;
            }

            $team = new Team();
            $team->setName($teamName)
                ->setIsActive($faker->boolean(80));

            // Assigner un leader
            $leader = $faker->randomElement($eligibleLeaders);
            $team->setLeader($leader);

            // Assigner 2-5 membres (incluant le leader)
            $teamMembers = $faker->randomElements($heroes, $faker->numberBetween(2, 5));
            if (!in_array($leader, $teamMembers)) {
                $teamMembers[] = $leader;
            }

            foreach ($teamMembers as $member) {
                $team->addMember($member);
            }

            $manager->persist($team);
            $teams[] = $team;
        }

        // Création des missions
        $missionTitles = [
            'Invasion Alien',
            'Menace Robotique',
            'Catastrophe Naturelle',
            'Organisation Criminelle',
            'Portail Dimensionnel',
            'Arme de Destruction Massive',
            'Enlèvement de Scientifique',
            'Vol de Technologie',
            'Attaque Terroriste',
            'Anomalie Temporelle',
            'Virus Mortel',
            'Réveil de Créature Ancienne',
            'Complot Gouvernemental',
            'Dictateur Fou',
            'Expérience Scientifique',
        ];

        $locations = [
            'New York', 'Tokyo', 'Londres', 'Paris', 'Berlin',
            'Moscou', 'Sydney', 'Rio', 'Le Caire', 'Mumbai',
            'Pékin', 'Rome', 'Barcelone', 'Los Angeles', 'Chicago'
        ];

        foreach ($missionTitles as $index => $title) {
            $mission = new Mission();
            $mission->setTitle($title)
                ->setDescription($faker->paragraphs(2, true))
                ->setStatus($faker->randomElement([
                    Mission::STATUS_PENDING,
                    Mission::STATUS_IN_PROGRESS,
                    Mission::STATUS_COMPLETED,
                    Mission::STATUS_FAILED
                ]))
                ->setStartAt($faker->dateTimeBetween('-1 month', '+1 month'))
                ->setEndAt($faker->dateTimeBetween('+1 month', '+3 months'))
                ->setLocation($faker->randomElement($locations))
                ->setDangerLevel($faker->numberBetween(1, 5));

            // Assigner des pouvoirs requis
            $requiredPowers = $faker->randomElements($powers, $faker->numberBetween(1, 3));
            foreach ($requiredPowers as $power) {
                $mission->addRequiredPower($power);
            }

            // Assigner une équipe aléatoire
            if (!empty($teams) && $faker->boolean(70)) {
                $mission->setAssignedTeam($faker->randomElement($teams));
            }

            $manager->persist($mission);
        }

        $manager->flush();
    }
}
