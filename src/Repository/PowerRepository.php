<?php

namespace App\Repository;

use App\Entity\Power;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Power>
 */
class PowerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Power::class);
    }

    /**
     * Trouve les pouvoirs par niveau
     */
    public function findByLevel(int $level): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.level = :level')
            ->setParameter('level', $level)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les pouvoirs de niveau minimum
     */
    public function findByMinLevel(int $minLevel): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.level >= :minLevel')
            ->setParameter('minLevel', $minLevel)
            ->orderBy('p.level', 'DESC')
            ->addOrderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les pouvoirs par nom (recherche partielle)
     */
    public function searchByName(string $searchTerm): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.name LIKE :searchTerm')
            ->setParameter('searchTerm', '%' . $searchTerm . '%')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}


