/**
 * Page détail d'un pouvoir
 */

import { DataManager } from '../services/data-manager';

export function renderPowerDetail(id: number) {
  const dataManager = DataManager.getInstance();
  const power = dataManager.getPowerById(id);

  const app = document.getElementById('app');
  if (!app) return;

  if (!power) {
    app.innerHTML = `
      <div class="alert alert-danger">
        <h4>Pouvoir non trouvé</h4>
        <p>Le pouvoir avec l'ID ${id} n'existe pas.</p>
        <a href="/powers" class="btn btn-primary">Retour à la liste</a>
      </div>
    `;
    return;
  }

  // Trouver les héros qui ont ce pouvoir
  const allHeroes = dataManager.getAllHeroes();
  const heroesWithPower = allHeroes.filter(hero => {
    const heroWithRelations = dataManager.getHeroWithRelations(hero.id);
    return heroWithRelations?.powers?.some(p => p.id === id);
  });

  app.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-bolt"></i> ${power.name}</h1>
      <p class="mb-0">Niveau ${power.level}/10</p>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5>Description</h5>
            <p>${power.description}</p>
            
            <h5 class="mt-4">Niveau</h5>
            <div class="progress mb-3" style="height: 30px;">
              <div class="progress-bar bg-warning" 
                   role="progressbar" 
                   style="width: ${(power.level / 10) * 100}%"
                   aria-valuenow="${power.level}" 
                   aria-valuemin="0" 
                   aria-valuemax="10">
                ${power.level}/10
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5>Héros possédant ce pouvoir</h5>
            ${heroesWithPower.length > 0 ? `
              <div class="list-group">
                ${heroesWithPower.map(hero => `
                  <a href="/heroes/${hero.id}" class="list-group-item list-group-item-action">
                    <i class="fas fa-mask"></i> ${hero.name}
                  </a>
                `).join('')}
              </div>
            ` : '<p class="text-muted">Aucun héros ne possède ce pouvoir.</p>'}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <a href="/powers" class="btn btn-secondary">Retour à la liste</a>
    </div>
  `;
}

