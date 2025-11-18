<?php
// src/Entity/Power.php
namespace App\Entity;

use App\Repository\PowerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PowerRepository::class)]
class Power
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom du pouvoir est obligatoire')]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'La description est obligatoire')]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\Range(
        min: 1,
        max: 5,
        notInRangeMessage: 'Le niveau doit être entre {{ min }} et {{ max }}'
    )]
    private ?int $level = 1;

    #[ORM\ManyToMany(targetEntity: SuperHero::class, mappedBy: 'powers')]
    private Collection $superHeroes;

    #[ORM\ManyToMany(targetEntity: Mission::class, mappedBy: 'requiredPowers')]
    private Collection $missions;

    public function __construct()
    {
        $this->superHeroes = new ArrayCollection();
        $this->missions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;
        return $this;
    }

    /**
     * @return Collection<int, SuperHero>
     */
    public function getSuperHeroes(): Collection
    {
        return $this->superHeroes;
    }

    public function addSuperHero(SuperHero $superHero): static
    {
        if (!$this->superHeroes->contains($superHero)) {
            $this->superHeroes->add($superHero);
            $superHero->addPower($this);
        }
        return $this;
    }

    public function removeSuperHero(SuperHero $superHero): static
    {
        if ($this->superHeroes->removeElement($superHero)) {
            $superHero->removePower($this);
        }
        return $this;
    }

    /**
     * @return Collection<int, Mission>
     */
    public function getMissions(): Collection
    {
        return $this->missions;
    }

    public function __toString(): string
    {
        return $this->name ?? '';
    }

    public function getLevelStars(): string
    {
        return str_repeat('⭐', $this->level);
    }
}
