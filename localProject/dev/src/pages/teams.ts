/**
 * Page liste des équipes
 */

import { DataManager } from '../services/data-manager';

export function renderTeams() {
  const dataManager = DataManager.getInstance();
  const teams = dataManager.getAllTeams();

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-users"></i> Équipes</h1>
      <p class="mb-0">Gestion des équipes</p>
    </div>

    ${teams.length > 0 ? `
      <div class="row g-4">
        ${teams.map(team => {
          const teamWithRelations = dataManager.getTeamWithRelations(team.id);
          return `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-users"></i> ${team.name}
                    ${team.is_active ? '<span class="badge bg-success float-end">Active</span>' : ''}
                  </h5>
                </div>
                <div class="card-body">
                  ${teamWithRelations?.leader ? `
                    <p class="mb-2">
                      <strong>Leader:</strong> 
                      <a href="/heroes/${teamWithRelations.leader.id}">${teamWithRelations.leader.name}</a>
                    </p>
                  ` : '<p class="text-muted mb-2">Aucun leader assigné</p>'}
                  ${teamWithRelations?.members && teamWithRelations.members.length > 0 ? `
                    <p class="mb-1"><strong>Membres:</strong> ${teamWithRelations.members.length}</p>
                    <div class="small">
                      ${teamWithRelations.members.slice(0, 3).map(m => m.name).join(', ')}
                      ${teamWithRelations.members.length > 3 ? ` et ${teamWithRelations.members.length - 3} autres...` : ''}
                    </div>
                  ` : '<p class="text-muted">Aucun membre</p>'}
                </div>
                <div class="card-footer">
                  <a href="/teams/${team.id}" class="btn btn-primary btn-sm w-100">Voir détails</a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Aucune équipe enregistrée.
      </div>
    `}
  `;
}

