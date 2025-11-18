/**
 * Router côté client pour la navigation SPA
 */

export type RouteHandler = () => void | Promise<void>;

interface Route {
  path: string;
  handler: RouteHandler;
}

class Router {
  private routes: Route[] = [];
  private currentHandler: RouteHandler | null = null;

  /**
   * Enregistre une route
   */
  on(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler });
  }

  /**
   * Navigue vers une route
   */
  navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  /**
   * Gère la route actuelle
   */
  handleRoute(): void {
    const path = window.location.pathname;
    const route = this.routes.find((r) => {
      // Match exact
      if (r.path === path) return true;
      // Match avec paramètres (ex: /heroes/:id)
      const pattern = r.path.replace(/:[^/]+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(path);
    });

    if (route) {
      this.currentHandler = route.handler;
      route.handler();
    } else {
      // Route 404
      this.handle404();
    }
  }

  /**
   * Gère la route 404
   */
  private handle404(): void {
    document.body.innerHTML = `
      <div class="container mt-5">
        <div class="alert alert-danger">
          <h1>404 - Page non trouvée</h1>
          <p>La page que vous recherchez n'existe pas.</p>
          <a href="/" class="btn btn-primary">Retour à l'accueil</a>
        </div>
      </div>
    `;
  }

  /**
   * Initialise le router
   */
  init(): void {
    // Gérer les clics sur les liens
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });

    // Gérer le bouton retour/avant
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Gérer la route initiale
    this.handleRoute();
  }
}

export const router = new Router();

