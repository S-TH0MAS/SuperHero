<?php

namespace App\Repository;

use App\Entity\Mission;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Mission>
 */
class MissionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mission::class);
    }

    /**
     * Trouve les missions par statut
     */
    public function findByStatus(string $status): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.status = :status')
            ->setParameter('status', $status)
            ->orderBy('m.startAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les missions en cours
     */
    public function findActiveMissions(): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.status = :status')
            ->setParameter('status', Mission::STATUS_IN_PROGRESS)
            ->orderBy('m.startAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les missions par niveau de danger
     */
    public function findByDangerLevel(int $dangerLevel): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.dangerLevel = :dangerLevel')
            ->setParameter('dangerLevel', $dangerLevel)
            ->orderBy('m.startAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les missions par équipe assignée
     */
    public function findByTeam(int $teamId): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.assignedTeam = :teamId')
            ->setParameter('teamId', $teamId)
            ->orderBy('m.startAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}


