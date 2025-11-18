/**
 * Page d'accueil - Dashboard
 * Utilise le template Twig du projet Symfony
 */

import { DataManager } from '../services/data-manager';
import { TwigLoader } from '../services/twig-loader';

export async function renderHome() {
  const dataManager = DataManager.getInstance();
  const stats = dataManager.getDashboardStats();
  const recentHeroes = dataManager.getAllHeroes()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);
  const recentMissions = dataManager.getAllMissions()
    .sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  try {
    // Préparer les données pour le template Twig
    const templateData = {
      // Ajouter app.flashes pour base.html.twig (peut être vide)
      app: {
        flashes: {},
      },
      stats,
      recentHeroes: recentHeroes.map(hero => ({
        ...hero,
        // Convertir les booléens pour Twig (1/0 au lieu de true/false)
        is_available: hero.is_available ? 1 : 0,
        // Ajouter les propriétés utilisées dans le template
        isAvailable: hero.is_available,
        energyLevel: hero.energy_level,
        alterEgo: hero.alter_ego,
      })),
      recentMissions: recentMissions.map(mission => ({
        ...mission,
        start_date: mission.start_date || null,
        startAt: mission.start_date || null,
        // Ajouter les propriétés utilisées dans le template
        title: mission.title,
        location: mission.location,
        statusBadgeClass: mission.status === 'pending' ? 'warning' : mission.status === 'in_progress' ? 'info' : 'success',
        statusLabel: mission.status === 'pending' ? 'En attente' : mission.status === 'in_progress' ? 'En cours' : 'Terminée',
        dangerLevelStars: '⭐'.repeat(mission.danger_level || 0),
      })),
    };

    // Compiler le template Twig
    // Le template home/index.html.twig contient {% extends 'base.html.twig' %}
    // base.html.twig génère tout le HTML complet (head + body avec nav, footer, etc.)
    const fullHtml = await TwigLoader.compile('home/index.html.twig', templateData);
    
    // Le template génère tout le HTML avec extends (DOCTYPE, html, head, body complet)
    // On doit extraire le body et mettre à jour le head si nécessaire
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHtml;
    
    // Extraire le head compilé pour mettre à jour le title et les styles
    const headElement = tempDiv.querySelector('head');
    if (headElement) {
      const title = headElement.querySelector('title');
      if (title) {
        document.title = title.textContent || 'S.H.I.E.L.D 2.0';
      }
    }
    
    // Extraire le body compilé
    const bodyElement = tempDiv.querySelector('body');
    if (bodyElement) {
      // Remplacer tout le body avec le contenu compilé (nav, main-container, footer)
      document.body.innerHTML = bodyElement.innerHTML;
    } else {
      // Si pas de body, utiliser tout le contenu
      document.body.innerHTML = fullHtml;
    }
  } catch (error) {
    console.error('Error rendering home page:', error);
    // Fallback si le template ne peut pas être chargé
    document.body.innerHTML = `
      <div class="container mt-5">
        <div class="alert alert-danger">
          <h4>Erreur de chargement</h4>
          <p>Impossible de charger le template.</p>
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>
    `;
  }
}
