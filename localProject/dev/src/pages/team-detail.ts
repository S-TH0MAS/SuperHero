/**
 * Page détail d'une équipe
 */

import { DataManager } from '../services/data-manager';

export function renderTeamDetail(id: number) {
  const dataManager = DataManager.getInstance();
  const team = dataManager.getTeamWithRelations(id);

  const app = document.getElementById('app');
  if (!app) return;

  if (!team) {
    app.innerHTML = `
      <div class="alert alert-danger">
        <h4>Équipe non trouvée</h4>
        <p>L'équipe avec l'ID ${id} n'existe pas.</p>
        <a href="/teams" class="btn btn-primary">Retour à la liste</a>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-users"></i> ${team.name}</h1>
      <p class="mb-0">
        ${team.is_active ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-secondary">Inactive</span>'}
      </p>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            ${team.leader ? `
              <h5>Leader</h5>
              <div class="card mb-3">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    ${team.leader.image_name ? `
                      <img src="/uploads/heroes/${team.leader.image_name}" 
                           class="rounded me-3" 
                           alt="${team.leader.name}"
                           style="width: 80px; height: 80px; object-fit: cover;"
                           onerror="this.style.display='none'">
                    ` : ''}
                    <div>
                      <h6 class="mb-0">
                        <a href="/heroes/${team.leader.id}">${team.leader.name}</a>
                      </h6>
                      ${team.leader.alter_ego ? `<p class="text-muted mb-0 small">${team.leader.alter_ego}</p>` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ` : '<p class="text-muted">Aucun leader assigné</p>'}

            <h5 class="mt-4">Membres (${team.members?.length || 0})</h5>
            ${team.members && team.members.length > 0 ? `
              <div class="row g-3">
                ${team.members.map(member => `
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          ${member.image_name ? `
                            <img src="/uploads/heroes/${member.image_name}" 
                                 class="rounded me-3" 
                                 alt="${member.name}"
                                 style="width: 60px; height: 60px; object-fit: cover;"
                                 onerror="this.style.display='none'">
                          ` : ''}
                          <div>
                            <h6 class="mb-0">
                              <a href="/heroes/${member.id}">${member.name}</a>
                            </h6>
                            ${member.alter_ego ? `<p class="text-muted mb-0 small">${member.alter_ego}</p>` : ''}
                            <span class="badge bg-${member.is_available ? 'success' : 'secondary'}">
                              ${member.is_available ? 'Disponible' : 'Indisponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="text-muted">Aucun membre dans cette équipe.</p>'}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <a href="/teams" class="btn btn-secondary">Retour à la liste</a>
    </div>
  `;
}

