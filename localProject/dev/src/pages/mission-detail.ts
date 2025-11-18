/**
 * Page détail d'une mission
 */

import { DataManager } from '../services/data-manager';

export function renderMissionDetail(id: number) {
  const dataManager = DataManager.getInstance();
  const mission = dataManager.getMissionWithRelations(id);

  const app = document.getElementById('app');
  if (!app) return;

  if (!mission) {
    app.innerHTML = `
      <div class="alert alert-danger">
        <h4>Mission non trouvée</h4>
        <p>La mission avec l'ID ${id} n'existe pas.</p>
        <a href="/missions" class="btn btn-primary">Retour à la liste</a>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-clipboard-list"></i> ${mission.title}</h1>
      <p class="mb-0">
        <span class="badge bg-${getStatusColor(mission.status)} fs-6">${mission.status}</span>
        <span class="badge bg-info fs-6 ms-2">Priorité: ${mission.priority}/10</span>
      </p>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5>Description</h5>
            <p>${mission.description}</p>
            
            <div class="row mt-4">
              <div class="col-md-6">
                <h6>Dates</h6>
                ${mission.start_date ? `
                  <p class="mb-1">
                    <i class="fas fa-calendar-check"></i> 
                    <strong>Début:</strong> ${formatDate(mission.start_date)}
                  </p>
                ` : '<p class="text-muted mb-1">Date de début non définie</p>'}
                ${mission.end_date ? `
                  <p class="mb-0">
                    <i class="fas fa-calendar-times"></i> 
                    <strong>Fin:</strong> ${formatDate(mission.end_date)}
                  </p>
                ` : '<p class="text-muted mb-0">Date de fin non définie</p>'}
              </div>
              <div class="col-md-6">
                <h6>Statut</h6>
                <p class="mb-1">
                  <span class="badge bg-${getStatusColor(mission.status)} fs-6">${mission.status}</span>
                </p>
                <p class="mb-0">
                  <strong>Priorité:</strong> ${mission.priority}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        ${mission.team ? `
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0"><i class="fas fa-users"></i> Équipe assignée</h6>
            </div>
            <div class="card-body">
              <h6>
                <a href="/teams/${mission.team.id}">${mission.team.name}</a>
              </h6>
              ${mission.team.is_active ? 
                '<span class="badge bg-success">Active</span>' : 
                '<span class="badge bg-secondary">Inactive</span>'}
            </div>
          </div>
        ` : ''}
        
        ${mission.powers && mission.powers.length > 0 ? `
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0"><i class="fas fa-bolt"></i> Pouvoirs requis</h6>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                ${mission.powers.map(power => `
                  <a href="/powers/${power.id}" class="list-group-item list-group-item-action">
                    <i class="fas fa-bolt text-warning"></i> ${power.name}
                    <span class="badge bg-info float-end">Niveau ${power.level}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="mt-4">
      <a href="/missions" class="btn btn-secondary">Retour à la liste</a>
    </div>
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

