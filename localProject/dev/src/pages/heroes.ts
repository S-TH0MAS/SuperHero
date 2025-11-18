/**
 * Page liste des héros
 */

import { DataManager } from '../services/data-manager';

export function renderHeroes() {
  const dataManager = DataManager.getInstance();
  const heroes = dataManager.getAllHeroes()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-mask"></i> Super-Héros</h1>
      <p class="mb-0">Gestion des super-héros</p>
    </div>

    ${heroes.length > 0 ? `
      <div class="row g-4">
        ${heroes.map(hero => `
          <div class="col-md-4 col-lg-3">
            <div class="card hero-card h-100">
              ${hero.image_name ? `
                <img src="/uploads/heroes/${hero.image_name}" 
                     class="card-img-top" 
                     alt="${hero.name}"
                     style="height: 250px; object-fit: cover;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23667eea\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'white\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${hero.name}%3C/text%3E%3C/svg%3E'">
              ` : `
                <div class="card-img-top bg-gradient d-flex align-items-center justify-content-center"
                     style="height: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <i class="fas fa-mask fa-5x text-white opacity-50"></i>
                </div>
              `}
              <div class="card-body">
                <h5 class="card-title">${hero.name}</h5>
                ${hero.alter_ego ? `<p class="card-text small text-muted">${hero.alter_ego}</p>` : ''}
                <div class="mb-2">
                  <div class="energy-bar">
                    <div class="energy-fill ${getEnergyClass(hero.energy_level)}" 
                         style="width: ${hero.energy_level}%"></div>
                  </div>
                  <small class="text-muted">Énergie: ${hero.energy_level}%</small>
                </div>
                <span class="badge bg-${hero.is_available ? 'success' : 'secondary'}">
                  ${hero.is_available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <div class="card-footer">
                <a href="/heroes/${hero.id}" class="btn btn-primary btn-sm w-100">Voir détails</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Aucun héros enregistré.
      </div>
    `}
  `;
}

function getEnergyClass(level: number): string {
  if (level < 30) return 'low';
  if (level < 70) return 'medium';
  return '';
}

