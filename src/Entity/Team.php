<?php
// src/Entity/Team.php
namespace App\Entity;

use App\Repository\TeamRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom de l\'équipe est obligatoire')]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'Le nom doit faire au moins {{ limit }} caractères'
    )]
    private ?string $name = null;

    #[ORM\Column]
    private ?bool $isActive = true;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'ledTeams')]
    #[Assert\NotNull(message: 'Un leader est obligatoire')]
    private ?SuperHero $leader = null;

    #[ORM\ManyToMany(targetEntity: SuperHero::class, inversedBy: 'teams')]
    #[Assert\Count(
        min: 2,
        max: 5,
        minMessage: 'Une équipe doit avoir au moins {{ limit }} membres',
        maxMessage: 'Une équipe ne peut pas avoir plus de {{ limit }} membres'
    )]
    private Collection $members;

    #[ORM\OneToOne(mappedBy: 'assignedTeam', cascade: ['persist', 'remove'])]
    private ?Mission $currentMission = null;

    #[ORM\OneToMany(mappedBy: 'assignedTeam', targetEntity: Mission::class)]
    private Collection $missions;

    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->missions = new ArrayCollection();
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

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
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

    public function getLeader(): ?SuperHero
    {
        return $this->leader;
    }

    public function setLeader(?SuperHero $leader): static
    {
        $this->leader = $leader;
        return $this;
    }

    /**
     * @return Collection<int, SuperHero>
     */
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(SuperHero $member): static
    {
        if (!$this->members->contains($member)) {
            $this->members->add($member);
        }
        return $this;
    }

    public function removeMember(SuperHero $member): static
    {
        $this->members->removeElement($member);
        return $this;
    }

    public function getCurrentMission(): ?Mission
    {
        return $this->currentMission;
    }

    public function setCurrentMission(?Mission $currentMission): static
    {
        if ($currentMission === null && $this->currentMission !== null) {
            $this->currentMission->setAssignedTeam(null);
        }

        if ($currentMission !== null && $currentMission->getAssignedTeam() !== $this) {
            $currentMission->setAssignedTeam($this);
        }

        $this->currentMission = $currentMission;
        return $this;
    }

    /**
     * @return Collection<int, Mission>
     */
    public function getMissions(): Collection
    {
        return $this->missions;
    }

    public function addMission(Mission $mission): static
    {
        if (!$this->missions->contains($mission)) {
            $this->missions->add($mission);
            $mission->setAssignedTeam($this);
        }
        return $this;
    }

    public function removeMission(Mission $mission): static
    {
        if ($this->missions->removeElement($mission)) {
            if ($mission->getAssignedTeam() === $this) {
                $mission->setAssignedTeam(null);
            }
        }
        return $this;
    }

    public function __toString(): string
    {
        return $this->name ?? '';
    }

    public function isAvailable(): bool
    {
        return $this->isActive && $this->currentMission === null;
    }

    public function getMembersCount(): int
    {
        return $this->members->count();
    }

    public function hasAllPowers(array $requiredPowers): bool
    {
        $teamPowers = [];
        foreach ($this->members as $member) {
            foreach ($member->getPowers() as $power) {
                $teamPowers[] = $power->getId();
            }
        }

        foreach ($requiredPowers as $requiredPower) {
            if (!in_array($requiredPower->getId(), $teamPowers)) {
                return false;
            }
        }

        return true;
    }
}
