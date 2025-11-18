<?php

namespace App\Repository;

use App\Entity\Team;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Team>
 */
class TeamRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Team::class);
    }

    /**
     * Trouve les équipes actives
     */
    public function findActive(): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.isActive = :isActive')
            ->setParameter('isActive', true)
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les équipes disponibles (actives et sans mission en cours)
     */
    public function findAvailable(): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.isActive = :isActive')
            ->setParameter('isActive', true)
            ->andWhere('t.currentMission IS NULL')
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les équipes par leader
     */
    public function findByLeader(int $leaderId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.leader = :leaderId')
            ->setParameter('leaderId', $leaderId)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche d'équipes par nom
     */
    public function searchByName(string $searchTerm): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.name LIKE :searchTerm')
            ->setParameter('searchTerm', '%' . $searchTerm . '%')
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}


