/**
 * Gestionnaire de données principal
 * Charge et gère toutes les données depuis les CSV
 */

import { CsvReader } from './csv-reader';
import type {
  SuperHero,
  Power,
  Team,
  Mission,
  SuperHeroPower,
  TeamSuperHero,
  MissionPower,
  SuperHeroWithRelations,
  TeamWithRelations,
  MissionWithRelations,
  DashboardStats,
} from '../types/entities';

export class DataManager {
  private static instance: DataManager;
  private heroes: SuperHero[] = [];
  private powers: Power[] = [];
  private teams: Team[] = [];
  private missions: Mission[] = [];
  private heroPowers: SuperHeroPower[] = [];
  private teamHeroes: TeamSuperHero[] = [];
  private missionPowers: MissionPower[] = [];

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  /**
   * Charge toutes les données depuis les CSV
   */
  async loadAll(): Promise<void> {
    const baseUrl = import.meta.env.DEV ? '/data' : './data';

    try {
      const [
        heroesData,
        powersData,
        teamsData,
        missionsData,
        heroPowersData,
        teamHeroesData,
        missionPowersData,
      ] = await Promise.all([
        CsvReader.loadCsv(`${baseUrl}/super_hero.csv`),
        CsvReader.loadCsv(`${baseUrl}/power.csv`),
        CsvReader.loadCsv(`${baseUrl}/team.csv`),
        CsvReader.loadCsv(`${baseUrl}/mission.csv`),
        CsvReader.loadCsv(`${baseUrl}/super_hero_power.csv`),
        CsvReader.loadCsv(`${baseUrl}/team_super_hero.csv`),
        CsvReader.loadCsv(`${baseUrl}/mission_power.csv`),
      ]);

      this.heroes = this.parseHeroes(heroesData);
      this.powers = this.parsePowers(powersData);
      this.teams = this.parseTeams(teamsData);
      this.missions = this.parseMissions(missionsData);
      this.heroPowers = this.parseHeroPowers(heroPowersData);
      this.teamHeroes = this.parseTeamHeroes(teamHeroesData);
      this.missionPowers = this.parseMissionPowers(missionPowersData);
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  // Parsers
  private parseHeroes(data: Record<string, string>[]): SuperHero[] {
    return data.map((row) => ({
      id: parseInt(row.id),
      name: row.name,
      alter_ego: row.alter_ego || null,
      is_available: row.is_available === '1' || row.is_available === 'true',
      energy_level: parseInt(row.energy_level) || 0,
      biography: row.biography || null,
      image_name: row.image_name || null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  private parsePowers(data: Record<string, string>[]): Power[] {
    return data.map((row) => ({
      id: parseInt(row.id),
      name: row.name,
      description: row.description,
      level: parseInt(row.level) || 1,
    }));
  }

  private parseTeams(data: Record<string, string>[]): Team[] {
    return data.map((row) => ({
      id: parseInt(row.id),
      name: row.name,
      is_active: row.is_active === '1' || row.is_active === 'true',
      leader_id: row.leader_id ? parseInt(row.leader_id) : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  private parseMissions(data: Record<string, string>[]): Mission[] {
    return data.map((row) => ({
      id: parseInt(row.id),
      title: row.title,
      description: row.description,
      status: row.status as Mission['status'],
      priority: parseInt(row.priority) || 1,
      start_date: row.start_date || null,
      end_date: row.end_date || null,
      team_id: row.team_id ? parseInt(row.team_id) : null,
    }));
  }

  private parseHeroPowers(data: Record<string, string>[]): SuperHeroPower[] {
    return data.map((row) => ({
      super_hero_id: parseInt(row.super_hero_id),
      power_id: parseInt(row.power_id),
    }));
  }

  private parseTeamHeroes(data: Record<string, string>[]): TeamSuperHero[] {
    return data.map((row) => ({
      team_id: parseInt(row.team_id),
      super_hero_id: parseInt(row.super_hero_id),
    }));
  }

  private parseMissionPowers(data: Record<string, string>[]): MissionPower[] {
    return data.map((row) => ({
      mission_id: parseInt(row.mission_id),
      power_id: parseInt(row.power_id),
    }));
  }

  // Getters
  getAllHeroes(): SuperHero[] {
    return [...this.heroes];
  }

  getHeroById(id: number): SuperHero | undefined {
    return this.heroes.find((h) => h.id === id);
  }

  getHeroWithRelations(id: number): SuperHeroWithRelations | undefined {
    const hero = this.getHeroById(id);
    if (!hero) return undefined;

    const powerIds = this.heroPowers
      .filter((hp) => hp.super_hero_id === id)
      .map((hp) => hp.power_id);
    const powers = this.powers.filter((p) => powerIds.includes(p.id));

    const teamIds = this.teamHeroes
      .filter((th) => th.super_hero_id === id)
      .map((th) => th.team_id);
    const teams = this.teams.filter((t) => teamIds.includes(t.id));

    return { ...hero, powers, teams };
  }

  getAllPowers(): Power[] {
    return [...this.powers];
  }

  getPowerById(id: number): Power | undefined {
    return this.powers.find((p) => p.id === id);
  }

  getAllTeams(): Team[] {
    return [...this.teams];
  }

  getTeamById(id: number): Team | undefined {
    return this.teams.find((t) => t.id === id);
  }

  getTeamWithRelations(id: number): TeamWithRelations | undefined {
    const team = this.getTeamById(id);
    if (!team) return undefined;

    const leader = team.leader_id ? this.getHeroById(team.leader_id) : undefined;
    const memberIds = this.teamHeroes
      .filter((th) => th.team_id === id)
      .map((th) => th.super_hero_id);
    const members = this.heroes.filter((h) => memberIds.includes(h.id));

    return { ...team, leader, members };
  }

  getAllMissions(): Mission[] {
    return [...this.missions];
  }

  getMissionById(id: number): Mission | undefined {
    return this.missions.find((m) => m.id === id);
  }

  getMissionWithRelations(id: number): MissionWithRelations | undefined {
    const mission = this.getMissionById(id);
    if (!mission) return undefined;

    const team = mission.team_id ? this.getTeamById(mission.team_id) : undefined;
    const powerIds = this.missionPowers
      .filter((mp) => mp.mission_id === id)
      .map((mp) => mp.power_id);
    const powers = this.powers.filter((p) => powerIds.includes(p.id));

    return { ...mission, team, powers };
  }

  // Statistiques
  getDashboardStats(): DashboardStats {
    return {
      totalHeroes: this.heroes.length,
      availableHeroes: this.heroes.filter((h) => h.is_available).length,
      totalTeams: this.teams.length,
      activeTeams: this.teams.filter((t) => t.is_active).length,
      pendingMissions: this.missions.filter((m) => m.status === 'PENDING').length,
      inProgressMissions: this.missions.filter((m) => m.status === 'IN_PROGRESS').length,
      completedMissions: this.missions.filter((m) => m.status === 'COMPLETED').length,
    };
  }

  // Filtres
  filterHeroes(filters: {
    availability?: boolean;
    energyMin?: number;
  }): SuperHero[] {
    let filtered = [...this.heroes];

    if (filters.availability !== undefined) {
      filtered = filtered.filter((h) => h.is_available === filters.availability);
    }

    if (filters.energyMin !== undefined) {
      filtered = filtered.filter((h) => h.energy_level >= filters.energyMin!);
    }

    return filtered;
  }
}

