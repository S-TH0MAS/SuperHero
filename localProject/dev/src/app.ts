/**
 * Point d'entrée principal de l'application
 */

// Importer les styles SCSS du projet Symfony
import './styles.scss';

import { DataManager } from './services/data-manager';
import { router } from './router';
import { setupTwigHelpers } from './services/twig-helpers';
import { renderHome } from './pages/home';
import { renderHeroes } from './pages/heroes';
import { renderHeroDetail } from './pages/hero-detail';
import { renderPowers } from './pages/powers';
import { renderPowerDetail } from './pages/power-detail';
import { renderTeams } from './pages/teams';
import { renderTeamDetail } from './pages/team-detail';
import { renderMissions } from './pages/missions';
import { renderMissionDetail } from './pages/mission-detail';

// Exposer DataManager globalement pour le debug
declare global {
  interface Window {
    dataManager: DataManager;
  }
}

/**
 * Initialise l'application
 */
async function init() {
  console.log('🚀 Initialisation de S.H.I.E.L.D 2.0...');

  // Configurer les helpers Twig
  setupTwigHelpers();

  // Initialiser la structure HTML de base
  initializeHTMLStructure();

  // Charger les données
  const dataManager = DataManager.getInstance();
  window.dataManager = dataManager; // Pour debug dans la console

  try {
    await dataManager.loadAll();
    console.log('✅ Données chargées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données:', error);
    showError('Impossible de charger les données. Vérifiez que les fichiers CSV sont présents.');
    return;
  }

  // Configurer les routes
  setupRoutes();

  // Initialiser le router
  router.init();

  console.log('✅ Application initialisée');
}

/**
 * Initialise la structure HTML de base (navigation, footer, conteneur principal)
 * Les templates Twig qui étendent base.html.twig vont remplacer le contenu du body
 */
function initializeHTMLStructure() {
  // S'assurer que le body contient au moins un conteneur pour le contenu
  // Les templates qui étendent base.html.twig vont remplacer tout le body
  // Donc on n'a pas besoin de créer la structure ici, elle sera créée par les templates
  console.log('✅ Structure HTML initialisée');
}

/**
 * Configure les routes
 */
function setupRoutes() {
  router.on('/', renderHome);
  router.on('/heroes', renderHeroes);
  router.on('/heroes/:id', () => {
    const id = parseInt(window.location.pathname.split('/').pop() || '0');
    renderHeroDetail(id);
  });
  router.on('/powers', renderPowers);
  router.on('/powers/:id', () => {
    const id = parseInt(window.location.pathname.split('/').pop() || '0');
    renderPowerDetail(id);
  });
  router.on('/teams', renderTeams);
  router.on('/teams/:id', () => {
    const id = parseInt(window.location.pathname.split('/').pop() || '0');
    renderTeamDetail(id);
  });
  router.on('/missions', renderMissions);
  router.on('/missions/:id', () => {
    const id = parseInt(window.location.pathname.split('/').pop() || '0');
    renderMissionDetail(id);
  });
}

/**
 * Affiche un message d'erreur
 */
function showError(message: string) {
  const body = document.body;
  if (body) {
    body.innerHTML = `
      <div class="container mt-5">
        <div class="alert alert-danger">
          <h4>Erreur</h4>
          <p>${message}</p>
        </div>
      </div>
    `;
  }
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
