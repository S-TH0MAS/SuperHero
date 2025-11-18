<?php
// src/Controller/HomeController.php
namespace App\Controller;

use App\Repository\MissionRepository;
use App\Repository\SuperHeroRepository;
use App\Repository\TeamRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(
        SuperHeroRepository $heroRepository,
        TeamRepository $teamRepository,
        MissionRepository $missionRepository
    ): Response {
        // Statistiques générales
        $totalHeroes = $heroRepository->count([]);
        $availableHeroes = $heroRepository->count(['isAvailable' => true]);
        $totalTeams = $teamRepository->count([]);
        $activeTeams = $teamRepository->count(['isActive' => true]);

        // Missions
        $pendingMissions = $missionRepository->count(['status' => 'PENDING']);
        $inProgressMissions = $missionRepository->count(['status' => 'IN_PROGRESS']);
        $completedMissions = $missionRepository->count(['status' => 'COMPLETED']);

        // Héros récents
        $recentHeroes = $heroRepository->findBy([], ['createdAt' => 'DESC'], 6);

        // Missions récentes
        $recentMissions = $missionRepository->findBy([], ['startAt' => 'DESC'], 5);

        return $this->render('home/index.html.twig', [
            'stats' => [
                'totalHeroes' => $totalHeroes,
                'availableHeroes' => $availableHeroes,
                'totalTeams' => $totalTeams,
                'activeTeams' => $activeTeams,
                'pendingMissions' => $pendingMissions,
                'inProgressMissions' => $inProgressMissions,
                'completedMissions' => $completedMissions,
            ],
            'recentHeroes' => $recentHeroes,
            'recentMissions' => $recentMissions,
        ]);
    }
}
