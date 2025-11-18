/**
 * Fonction path() pour générer les URLs
 * Remplace la fonction Symfony path()
 */
export function twigPath(routeName: string, params: Record<string, any> = {}): string {
  const routes: Record<string, (params?: Record<string, any>) => string> = {
    'app_home': () => '/',
    'super_hero_index': () => '/heroes',
    'super_hero_new': () => '/heroes/new',
    'super_hero_show': (p) => `/heroes/${p?.id || ''}`,
    'super_hero_edit': (p) => `/heroes/${p?.id || ''}/edit`,
    'app_power_index': () => '/powers',
    'app_power_new': () => '/powers/new',
    'app_power_show': (p) => `/powers/${p?.id || ''}`,
    'app_power_edit': (p) => `/powers/${p?.id || ''}/edit`,
    'app_team_index': () => '/teams',
    'app_team_new': () => '/teams/new',
    'app_team_show': (p) => `/teams/${p?.id || ''}`,
    'app_team_edit': (p) => `/teams/${p?.id || ''}/edit`,
    'app_mission_index': () => '/missions',
    'app_mission_new': () => '/missions/new',
    'app_mission_show': (p) => `/missions/${p?.id || ''}`,
    'app_mission_edit': (p) => `/missions/${p?.id || ''}/edit`,
  };

  const route = routes[routeName];
  if (!route) {
    console.warn(`Route ${routeName} not found`);
    return '#';
  }

  return route(params);
}

/**
 * Fonction asset() pour générer les URLs d'assets
 * Remplace la fonction Symfony asset()
 */
export function twigAsset(path: string): string {
  // En dev, utiliser le proxy Express
  // @ts-ignore
    if (import.meta.env.DEV) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  // En prod, utiliser les chemins relatifs
  return path.startsWith('/') ? `.${path}` : `./${path}`;
}

/**
 * Fonction date() pour formater les dates
 * Remplace le filtre Twig date()
 */
export function twigDate(date: string | null, format: string = 'd/m/Y'): string {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  // Format simple (peut être étendu)
  if (format === 'd/m/Y') {
    return d.toLocaleDateString('fr-FR');
  }
  if (format === 'Y-m-d') {
    return d.toISOString().split('T')[0];
  }

  return d.toLocaleDateString('fr-FR');
}

/**
 * Configure les helpers Twig globaux
 */
export function setupTwigHelpers() {
  // Ajouter les fonctions globales à Twig
  if (typeof window !== 'undefined' && (window as any).Twig) {
    const Twig = (window as any).Twig;

    Twig.extendFunction('path', twigPath);
    Twig.extendFunction('asset', twigAsset);
    Twig.extendFilter('date', (value: string, params: any[]) => {
      return twigDate(value, params[0] || 'd/m/Y');
    });
  }
}

