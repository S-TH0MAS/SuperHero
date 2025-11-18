/**
 * Page liste des missions
 */

import { DataManager } from '../services/data-manager';

export function renderMissions() {
  const dataManager = DataManager.getInstance();
  const missions = dataManager.getAllMissions();

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-clipboard-list"></i> Missions</h1>
      <p class="mb-0">Gestion des missions</p>
    </div>

    ${missions.length > 0 ? `
      <div class="row g-4">
        ${missions.map(mission => {
          const missionWithRelations = dataManager.getMissionWithRelations(mission.id);
          return `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">${mission.title}</h5>
                </div>
                <div class="card-body">
                  <p class="card-text">${mission.description.substring(0, 150)}${mission.description.length > 150 ? '...' : ''}</p>
                  <div class="mb-2">
                    <span class="badge bg-${getStatusColor(mission.status)}">${mission.status}</span>
                    <span class="badge bg-info">Priorité: ${mission.priority}/10</span>
                  </div>
                  ${missionWithRelations?.team ? `
                    <p class="small mb-0">
                      <i class="fas fa-users"></i> Équipe: 
                      <a href="/teams/${missionWithRelations.team.id}">${missionWithRelations.team.name}</a>
                    </p>
                  ` : '<p class="text-muted small mb-0">Aucune équipe assignée</p>'}
                  ${mission.start_date ? `
                    <p class="small text-muted mb-0 mt-2">
                      <i class="fas fa-calendar"></i> ${formatDate(mission.start_date)}
                    </p>
                  ` : ''}
                </div>
                <div class="card-footer">
                  <a href="/missions/${mission.id}" class="btn btn-primary btn-sm w-100">Voir détails</a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Aucune mission enregistrée.
      </div>
    `}
  `;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'PENDING': 'warning',
    'IN_PROGRESS': 'info',
    'COMPLETED': 'success',
    'FAILED': 'danger',
  };
  return colors[status] || 'secondary';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}

