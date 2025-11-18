<?php
// src/Entity/Mission.php
namespace App\Entity;

use App\Repository\MissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MissionRepository::class)]
class Mission
{
    public const STATUS_PENDING = 'PENDING';
    public const STATUS_IN_PROGRESS = 'IN_PROGRESS';
    public const STATUS_COMPLETED = 'COMPLETED';
    public const STATUS_FAILED = 'FAILED';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le titre est obligatoire')]
    #[Assert\Length(
        min: 5,
        max: 255,
        minMessage: 'Le titre doit faire au moins {{ limit }} caractères'
    )]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'La description est obligatoire')]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(
        choices: [self::STATUS_PENDING, self::STATUS_IN_PROGRESS, self::STATUS_COMPLETED, self::STATUS_FAILED],
        message: 'Statut invalide'
    )]
    private ?string $status = self::STATUS_PENDING;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull(message: 'La date de début est obligatoire')]
    private ?\DateTimeInterface $startAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Assert\GreaterThan(
        propertyPath: 'startAt',
        message: 'La date de fin doit être après la date de début'
    )]
    private ?\DateTimeInterface $endAt = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le lieu est obligatoire')]
    private ?string $location = null;

    #[ORM\Column]
    #[Assert\Range(
        min: 1,
        max: 5,
        notInRangeMessage: 'Le niveau de danger doit être entre {{ min }} et {{ max }}'
    )]
    private ?int $dangerLevel = 1;

    #[ORM\ManyToOne(inversedBy: 'missions')]
    private ?Team $assignedTeam = null;

    #[ORM\ManyToMany(targetEntity: Power::class, inversedBy: 'missions')]
    private Collection $requiredPowers;

    public function __construct()
    {
        $this->requiredPowers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getStartAt(): ?\DateTimeInterface
    {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeInterface $startAt): static
    {
        $this->startAt = $startAt;
        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): static
    {
        $this->endAt = $endAt;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getDangerLevel(): ?int
    {
        return $this->dangerLevel;
    }

    public function setDangerLevel(int $dangerLevel): static
    {
        $this->dangerLevel = $dangerLevel;
        return $this;
    }

    public function getAssignedTeam(): ?Team
    {
        return $this->assignedTeam;
    }

    public function setAssignedTeam(?Team $assignedTeam): static
    {
        $this->assignedTeam = $assignedTeam;
        return $this;
    }

    /**
     * @return Collection<int, Power>
     */
    public function getRequiredPowers(): Collection
    {
        return $this->requiredPowers;
    }

    public function addRequiredPower(Power $requiredPower): static
    {
        if (!$this->requiredPowers->contains($requiredPower)) {
            $this->requiredPowers->add($requiredPower);
        }
        return $this;
    }

    public function removeRequiredPower(Power $requiredPower): static
    {
        $this->requiredPowers->removeElement($requiredPower);
        return $this;
    }

    public function __toString(): string
    {
        return $this->title ?? '';
    }

    public function getStatusBadgeClass(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'warning',
            self::STATUS_IN_PROGRESS => 'info',
            self::STATUS_COMPLETED => 'success',
            self::STATUS_FAILED => 'danger',
            default => 'secondary',
        };
    }

    public function getStatusLabel(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'En attente',
            self::STATUS_IN_PROGRESS => 'En cours',
            self::STATUS_COMPLETED => 'Terminée',
            self::STATUS_FAILED => 'Échouée',
            default => 'Inconnu',
        };
    }

    public function getDangerLevelStars(): string
    {
        return str_repeat('⚠️', $this->dangerLevel);
    }

    public static function getStatusChoices(): array
    {
        return [
            'En attente' => self::STATUS_PENDING,
            'En cours' => self::STATUS_IN_PROGRESS,
            'Terminée' => self::STATUS_COMPLETED,
            'Échouée' => self::STATUS_FAILED,
        ];
    }
}
