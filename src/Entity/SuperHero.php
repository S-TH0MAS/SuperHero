<?php
// src/Entity/SuperHero.php
namespace App\Entity;

use App\Repository\SuperHeroRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SuperHeroRepository::class)]
#[ORM\HasLifecycleCallbacks]
class SuperHero
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'Le nom doit faire au moins {{ limit }} caractères'
    )]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $alterEgo = null;

    #[ORM\Column]
    private ?bool $isAvailable = true;

    #[ORM\Column]
    #[Assert\Range(
        min: 0,
        max: 100,
        notInRangeMessage: 'Le niveau d\'énergie doit être entre {{ min }} et {{ max }}'
    )]
    private ?int $energyLevel = 100;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(max: 2000)]
    private ?string $biography = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imageName = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToMany(targetEntity: Power::class, inversedBy: 'superHeroes')]
    private Collection $powers;

    #[ORM\ManyToMany(targetEntity: Team::class, mappedBy: 'members')]
    private Collection $teams;

    #[ORM\OneToMany(mappedBy: 'leader', targetEntity: Team::class)]
    private Collection $ledTeams;

    public function __construct()
    {
        $this->powers = new ArrayCollection();
        $this->teams = new ArrayCollection();
        $this->ledTeams = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
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

    public function getAlterEgo(): ?string
    {
        return $this->alterEgo;
    }

    public function setAlterEgo(?string $alterEgo): static
    {
        $this->alterEgo = $alterEgo;
        return $this;
    }

    public function isAvailable(): ?bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(bool $isAvailable): static
    {
        $this->isAvailable = $isAvailable;
        return $this;
    }

    public function getEnergyLevel(): ?int
    {
        return $this->energyLevel;
    }

    public function setEnergyLevel(int $energyLevel): static
    {
        $this->energyLevel = $energyLevel;
        return $this;
    }

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(?string $biography): static
    {
        $this->biography = $biography;
        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): static
    {
        $this->imageName = $imageName;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return Collection<int, Power>
     */
    public function getPowers(): Collection
    {
        return $this->powers;
    }

    public function addPower(Power $power): static
    {
        if (!$this->powers->contains($power)) {
            $this->powers->add($power);
        }
        return $this;
    }

    public function removePower(Power $power): static
    {
        $this->powers->removeElement($power);
        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): static
    {
        if (!$this->teams->contains($team)) {
            $this->teams->add($team);
            $team->addMember($this);
        }
        return $this;
    }

    public function removeTeam(Team $team): static
    {
        if ($this->teams->removeElement($team)) {
            $team->removeMember($this);
        }
        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getLedTeams(): Collection
    {
        return $this->ledTeams;
    }

    public function addLedTeam(Team $ledTeam): static
    {
        if (!$this->ledTeams->contains($ledTeam)) {
            $this->ledTeams->add($ledTeam);
            $ledTeam->setLeader($this);
        }
        return $this;
    }

    public function removeLedTeam(Team $ledTeam): static
    {
        if ($this->ledTeams->removeElement($ledTeam)) {
            if ($ledTeam->getLeader() === $this) {
                $ledTeam->setLeader(null);
            }
        }
        return $this;
    }

    public function __toString(): string
    {
        return $this->name ?? '';
    }

    public function canBeLeader(): bool
    {
        return $this->energyLevel > 80;
    }
}
