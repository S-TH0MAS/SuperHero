/**
 * Page détail d'un héros
 */

import { DataManager } from '../services/data-manager';

export function renderHeroDetail(id: number) {
  const dataManager = DataManager.getInstance();
  const hero = dataManager.getHeroWithRelations(id);

  const app = document.getElementById('app');
  if (!app) return;

  if (!hero) {
    app.innerHTML = `
      <div class="alert alert-danger">
        <h4>Héros non trouvé</h4>
        <p>Le héros avec l'ID ${id} n'existe pas.</p>
        <a href="/heroes" class="btn btn-primary">Retour à la liste</a>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-mask"></i> ${hero.name}</h1>
      <p class="mb-0">${hero.alter_ego || 'Super-héros'}</p>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card">
          ${hero.image_name ? `
            <img src="/uploads/heroes/${hero.image_name}" 
                 class="card-img-top" 
                 alt="${hero.name}"
                 style="height: 400px; object-fit: cover;"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23667eea\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'white\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${hero.name}%3C/text%3E%3C/svg%3E'">
          ` : `
            <div class="card-img-top bg-gradient d-flex align-items-center justify-content-center"
                 style="height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="fas fa-mask fa-5x text-white opacity-50"></i>
            </div>
          `}
          <div class="card-body">
            <h5>Statut</h5>
            <p>
              <span class="badge bg-${hero.is_available ? 'success' : 'secondary'} fs-6">
                ${hero.is_available ? 'Disponible' : 'Indisponible'}
              </span>
            </p>
            <h5>Niveau d'énergie</h5>
            <div class="energy-bar mb-2">
              <div class="energy-fill ${getEnergyClass(hero.energy_level)}" 
                   style="width: ${hero.energy_level}%"></div>
            </div>
            <p class="text-muted">${hero.energy_level}%</p>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5>Biographie</h5>
            <p>${hero.biography || 'Aucune biographie disponible.'}</p>
            
            ${hero.powers && hero.powers.length > 0 ? `
              <h5 class="mt-4">Pouvoirs</h5>
              <div class="row g-2">
                ${hero.powers.map(power => `
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-body">
                        <h6>${power.name}</h6>
                        <p class="small mb-1">${power.description}</p>
                        <span class="badge bg-info">Niveau ${power.level}/10</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${hero.teams && hero.teams.length > 0 ? `
              <h5 class="mt-4">Équipes</h5>
              <div class="list-group">
                ${hero.teams.map(team => `
                  <a href="/teams/${team.id}" class="list-group-item list-group-item-action">
                    <i class="fas fa-users"></i> ${team.name}
                    ${team.is_active ? '<span class="badge bg-success float-end">Active</span>' : ''}
                  </a>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <a href="/heroes" class="btn btn-secondary">Retour à la liste</a>
    </div>
  `;
}

function getEnergyClass(level: number): string {
  if (level < 30) return 'low';
  if (level < 70) return 'medium';
  return '';
}

