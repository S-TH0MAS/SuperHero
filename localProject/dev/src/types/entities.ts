/**
 * Types TypeScript pour les entités
 * Correspondent aux entités PHP Symfony
 */

export interface SuperHero {
    id: number;
    name: string;
    alter_ego: string | null;
    is_available: boolean;
    energy_level: number;
    biography: string | null;
    image_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface Power {
    id: number;
    name: string;
    description: string;
    level: number;
}

export interface Team {
    id: number;
    name: string;
    is_active: boolean;
    leader_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface Mission {
    location: string;
    danger_level: number;
    id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    priority: number;
    start_date: string | null;
    end_date: string | null;
    team_id: number | null;
}

// Relations many-to-many
export interface SuperHeroPower {
    super_hero_id: number;
    power_id: number;
}

export interface TeamSuperHero {
    team_id: number;
    super_hero_id: number;
}

export interface MissionPower {
    mission_id: number;
    power_id: number;
}

// Types étendus avec relations
export interface SuperHeroWithRelations extends SuperHero {
    powers?: Power[];
    teams?: Team[];
}

export interface TeamWithRelations extends Team {
    leader?: SuperHero;
    members?: SuperHero[];
}

export interface MissionWithRelations extends Mission {
    team?: Team;
    powers?: Power[];
}

// Statistiques pour le dashboard
export interface DashboardStats {
    totalHeroes: number;
    availableHeroes: number;
    totalTeams: number;
    activeTeams: number;
    pendingMissions: number;
    inProgressMissions: number;
    completedMissions: number;
}

