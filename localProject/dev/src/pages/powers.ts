/**
 * Page liste des pouvoirs
 */

import { DataManager } from '../services/data-manager';

export function renderPowers() {
  const dataManager = DataManager.getInstance();
  const powers = dataManager.getAllPowers();

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-bolt"></i> Pouvoirs</h1>
      <p class="mb-0">Gestion des pouvoirs</p>
    </div>

    ${powers.length > 0 ? `
      <div class="row g-4">
        ${powers.map(power => `
          <div class="col-md-6 col-lg-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-bolt text-warning"></i> ${power.name}
                </h5>
                <p class="card-text">${power.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-info">Niveau ${power.level}/10</span>
                  <a href="/powers/${power.id}" class="btn btn-sm btn-primary">Voir détails</a>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Aucun pouvoir enregistré.
      </div>
    `}
  `;
}

