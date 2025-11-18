<?php

namespace App\Repository;

use App\Entity\SuperHero;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SuperHero>
 */
class SuperHeroRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SuperHero::class);
    }

    /**
     * Trouve les super-héros disponibles
     */
    public function findAvailable(): array
    {
        return $this->createQueryBuilder('sh')
            ->andWhere('sh.isAvailable = :isAvailable')
            ->setParameter('isAvailable', true)
            ->orderBy('sh.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les super-héros par niveau d'énergie minimum
     */
    public function findByMinEnergyLevel(int $minEnergyLevel): array
    {
        return $this->createQueryBuilder('sh')
            ->andWhere('sh.energyLevel >= :minEnergyLevel')
            ->setParameter('minEnergyLevel', $minEnergyLevel)
            ->andWhere('sh.isAvailable = :isAvailable')
            ->setParameter('isAvailable', true)
            ->orderBy('sh.energyLevel', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les super-héros éligibles pour être leader
     */
    public function findPotentialLeaders(): array
    {
        return $this->createQueryBuilder('sh')
            ->andWhere('sh.energyLevel > :minEnergy')
            ->setParameter('minEnergy', 80)
            ->andWhere('sh.isAvailable = :isAvailable')
            ->setParameter('isAvailable', true)
            ->orderBy('sh.energyLevel', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche de super-héros par nom ou alter ego
     */
    public function searchByNameOrAlterEgo(string $searchTerm): array
    {
        return $this->createQueryBuilder('sh')
            ->andWhere('sh.name LIKE :searchTerm OR sh.alterEgo LIKE :searchTerm')
            ->setParameter('searchTerm', '%' . $searchTerm . '%')
            ->orderBy('sh.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}


