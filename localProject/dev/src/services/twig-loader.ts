/**
 * Service pour charger et compiler les templates Twig côté client
 * Version 100% front-end - charge les templates depuis /public/templates/
 */

import Twig from 'twig';
import { twigPath, twigAsset, twigDate } from './twig-helpers';

export class TwigLoader {
    // Chemin vers les templates dans le dossier public
    private static baseUrl = '/templates';
    private static templateCache: Map<string, string> = new Map();
    private static helpersConfigured = false;

    /**
     * Configure les helpers Twig une seule fois
     */
    private static configureHelpers() {
        if (this.helpersConfigured) return;

        try {
            // Configurer les fonctions AVANT Twig.extend pour s'assurer qu'elles sont disponibles
            // Enregistrer les fonctions directement sur Twig
            (Twig as any).extendFunction('path', (routeName: string, params: Record<string, any> = {}) => {
                return twigPath(routeName, params);
            });

            (Twig as any).extendFunction('asset', (path: string) => {
                return twigAsset(path);
            });

            // Fonctions Symfony stub pour compatibilité
            // Ces fonctions sont utilisées dans base.html.twig mais ne sont pas nécessaires côté client
            (Twig as any).extendFunction('encore_entry_link_tags', function(entryName: string) {
                // Les styles sont déjà chargés dans index.html
                return '';
            });

            (Twig as any).extendFunction('encore_entry_script_tags', function(entryName: string) {
                // Les scripts sont déjà chargés dans index.html
                return '';
            });

            // Fonction include synchrone pour gérer {{ include('template.html.twig', { vars }) }}
            // Les templates doivent être préchargés dans le cache avant la compilation
            (Twig as any).extendFunction('include', function(templatePath: string, variables: Record<string, any> = {}) {
                try {
                    // Nettoyer le chemin
                    const cleanPath = templatePath.replace(/^\//, '');
                    
                    // Vérifier si le template est dans le cache
                    if (!TwigLoader.templateCache.has(cleanPath)) {
                        console.error(`Template ${cleanPath} not found in cache. Make sure to preload templates before compilation.`);
                        return `<!-- Error: Template ${cleanPath} not found in cache -->`;
                    }
                    
                    // Récupérer le contenu depuis le cache
                    const includedContent = TwigLoader.templateCache.get(cleanPath)!;
                    
                    // Compiler le template inclus avec les variables (synchrone)
                    const template = Twig.twig({
                        data: includedContent,
                        rethrow: true,
                        autoescape: true,
                    } as any);
                    
                    // Rendre le template avec les variables passées
                    return template.render(variables || {});
                } catch (error) {
                    console.error(`Error in include function for ${templatePath}:`, error);
                    return `<!-- Error loading include: ${templatePath} -->`;
                }
            });

            // Configurer le filtre date directement sur Twig global
            (Twig as any).extendFilter('date', function(value: any, params: any) {
                try {
                    // Normaliser les paramètres (peut être un tableau ou un objet)
                    let format = 'd/m/Y';
                    if (params) {
                        if (Array.isArray(params) && params.length > 0) {
                            format = params[0];
                        } else if (typeof params === 'string') {
                            format = params;
                        } else if (params.format) {
                            format = params.format;
                        }
                    }
                    
                    // Gérer le cas spécial 'now' pour obtenir la date actuelle
                    // Dans Twig, 'now' est une chaîne littérale entre guillemets
                    const valueStr = String(value || '');
                    if (valueStr.toLowerCase() === 'now' || value === 'now') {
                        const now = new Date();
                        if (format === 'Y') {
                            return now.getFullYear().toString();
                        }
                        return twigDate(now.toISOString(), format);
                    }
                    
                    // Si la valeur est undefined, null ou vide, retourner une chaîne vide
                    if (value === undefined || value === null || value === '') {
                        return '';
                    }
                    
                    // Convertir la valeur en chaîne si ce n'est pas déjà le cas
                    const dateValue = typeof value === 'string' ? value : String(value);
                    return twigDate(dateValue, format);
                } catch (error) {
                    console.error('Error in date filter:', error, 'value:', value, 'params:', params);
                    // Retourner une valeur par défaut plutôt que de planter
                    let format = 'd/m/Y';
                    if (params && Array.isArray(params) && params.length > 0) {
                        format = params[0];
                    }
                    if (format === 'Y') {
                        return new Date().getFullYear().toString();
                    }
                    return '';
                }
            });

            // Configurer le système de chargement de templates pour twig.js
            // Cela permet à twig.js de gérer automatiquement les extends et includes
            Twig.extend((TwigInstance: any) => {
                // Dans Twig.extend(), le paramètre est l'instance Twig, pas l'objet global
                // Utiliser TwigInstance au lieu de Twig pour éviter les conflits
                
                // Les fonctions et filtres sont déjà enregistrés directement sur Twig global ci-dessus
                // Pas besoin de les réenregistrer ici car ils sont globaux

                // Configurer le loader de templates pour gérer extends et includes
                // twig.js appelle loadRemote avec différentes options selon le contexte
                // Note: Utiliser TwigInstance au lieu de Twig pour éviter les conflits
                TwigInstance.Templates.loadRemote = function(options: any) {
                    return new Promise((resolve, reject) => {
                        // Extraire l'URL du template
                        // options peut être une chaîne (URL) ou un objet avec 'url' ou 'path'
                        let url = options;
                        if (typeof options === 'object' && options !== null) {
                            url = options.url || options.path || options;
                        }
                        
                        // Nettoyer l'URL pour obtenir le chemin du template
                        let templatePath = String(url);
                        
                        // Si l'URL contient le baseUrl, l'enlever
                        if (templatePath.includes(TwigLoader.baseUrl)) {
                            templatePath = templatePath.replace(TwigLoader.baseUrl + '/', '');
                        }
                        
                        // Nettoyer le chemin (enlever les slashes en début)
                        templatePath = templatePath.replace(/^\//, '');

                        // Utiliser le cache si disponible
                        if (TwigLoader.templateCache.has(templatePath)) {
                            let cachedContent = TwigLoader.templateCache.get(templatePath)!;
                            // Pré-traiter 'now'|date même pour les templates en cache
                            cachedContent = TwigLoader.preprocessNowDate(cachedContent);
                            resolve(cachedContent);
                            return;
                        }

                        // Charger depuis le serveur
                        const fetchUrl = `${TwigLoader.baseUrl}/${templatePath}`;
                        fetch(fetchUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to load template ${templatePath}: ${response.statusText} (${response.status})`);
                                }
                                return response.text();
                            })
                            .then(content => {
                                // Pré-traiter 'now'|date avant de mettre en cache
                                const preprocessedContent = TwigLoader.preprocessNowDate(content);
                                TwigLoader.templateCache.set(templatePath, preprocessedContent);
                                resolve(preprocessedContent);
                            })
                            .catch(reject);
                    });
                };
            });

            this.helpersConfigured = true;
            console.log('✅ Twig helpers configurés');
        } catch (error) {
            console.error('❌ Erreur lors de la configuration des helpers Twig:', error);
        }
    }

    /**
     * Pré-traite un template pour remplacer 'now'|date par la valeur actuelle
     */
    static preprocessNowDate(content: string): string {
        return content.replace(
            /\{\{\s*['"]now['"]\s*\|\s*date\(['"]([^'"]+)['"]\)\s*\}\}/g,
            (match, format) => {
                const now = new Date();
                if (format === 'Y') {
                    return now.getFullYear().toString();
                }
                return twigDate(now.toISOString(), format);
            }
        );
    }

    /**
     * Charge un template Twig depuis le dossier public
     */
    static async loadTemplate(templatePath: string): Promise<string> {
        // Nettoyer le chemin
        const cleanPath = templatePath.replace(/^\//, '');

        // Vérifier le cache
        if (this.templateCache.has(cleanPath)) {
            return this.templateCache.get(cleanPath)!;
        }

        try {
            const url = `${this.baseUrl}/${cleanPath}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to load template ${cleanPath}: ${response.statusText} (${response.status})`);
            }

            const templateContent = await response.text();
            // Pré-traiter 'now'|date avant de mettre en cache
            const preprocessedContent = this.preprocessNowDate(templateContent);
            this.templateCache.set(cleanPath, preprocessedContent);

            return preprocessedContent;
        } catch (error) {
            console.error(`Error loading template ${cleanPath}:`, error);
            throw error;
        }
    }

    /**
     * Résout récursivement les extends et includes dans un template
     */
    static async resolveTemplate(templatePath: string, visited: Set<string> = new Set()): Promise<string> {
        // Nettoyer le chemin
        const cleanPath = templatePath.replace(/^\//, '');
        
        // Éviter les boucles infinies
        if (visited.has(cleanPath)) {
            return await this.loadTemplate(cleanPath);
        }
        visited.add(cleanPath);

        // Charger le template
        let content = await this.loadTemplate(cleanPath);

        // Note: Les includes avec la syntaxe {{ include(...) }} sont gérés par la fonction include
        // définie dans configureHelpers(). Ils ne sont pas résolus ici car ils nécessitent
        // les variables passées lors de la compilation.

        // Résoudre les extends
        const extendsRegex = /{%\s*extends\s+['"]([^'"]+)['"]\s*%}/;
        const extendsMatch = content.match(extendsRegex);
        
        if (extendsMatch) {
            const parentPath = extendsMatch[1];
            const parentContent = await this.resolveTemplate(parentPath, new Set(visited));
            
            // Extraire les blocks du template enfant
            const blockRegex = /{%\s*block\s+(\w+)\s*%}([\s\S]*?){%\s*endblock\s*%}/g;
            const blocks: Record<string, string> = {};
            let blockMatch;
            
            while ((blockMatch = blockRegex.exec(content)) !== null) {
                blocks[blockMatch[1]] = blockMatch[2];
            }
            
            // Remplacer les blocks dans le parent
            content = parentContent;
            Object.keys(blocks).forEach(blockName => {
                const blockRegexInParent = new RegExp(
                    `{%\\s*block\\s+${blockName}\\s*%}([\\s\\S]*?){%\\s*endblock\\s*%}`,
                    'g'
                );
                const childBlock = blocks[blockName];
                
                // Gérer {{ parent() }} dans le block enfant
                const parentCallRegex = /\{\{\s*parent\(\)\s*\}\}/g;
                if (parentCallRegex.test(childBlock)) {
                    // Récupérer le contenu du block parent
                    const parentBlockMatch = parentContent.match(
                        new RegExp(`{%\\s*block\\s+${blockName}\\s*%}([\\s\\S]*?){%\\s*endblock\\s*%}`)
                    );
                    const parentBlockContent = parentBlockMatch ? parentBlockMatch[1] : '';
                    
                    // Remplacer {{ parent() }} par le contenu du parent
                    const resolvedBlock = childBlock.replace(parentCallRegex, parentBlockContent);
                    content = content.replace(blockRegexInParent, `{% block ${blockName} %}${resolvedBlock}{% endblock %}`);
                } else {
                    // Pas de parent(), remplacer complètement
                    content = content.replace(blockRegexInParent, `{% block ${blockName} %}${childBlock}{% endblock %}`);
                }
            });
            
            // Enlever la directive extends
            content = content.replace(extendsRegex, '');
        }

        // Résoudre les includes
        const includeRegex = /{%\s*include\s+['"]([^'"]+)['"]\s*%}/g;
        const includes: Array<{match: string, path: string}> = [];
        let includeMatch;
        
        while ((includeMatch = includeRegex.exec(content)) !== null) {
            includes.push({
                match: includeMatch[0],
                path: includeMatch[1]
            });
        }
        
        // Charger et remplacer les includes
        for (const inc of includes) {
            const includedContent = await this.resolveTemplate(inc.path, new Set(visited));
            content = content.replace(inc.match, includedContent);
        }

        return content;
    }

    /**
     * Précharge récursivement tous les templates nécessaires (extends, includes)
     * pour qu'ils soient disponibles dans le cache lors de la compilation
     */
    private static async preloadTemplates(templatePath: string, visited: Set<string> = new Set()): Promise<void> {
        const cleanPath = templatePath.replace(/^\//, '');
        
        // Éviter les boucles infinies
        if (visited.has(cleanPath)) {
            return;
        }
        visited.add(cleanPath);

        // Charger le template s'il n'est pas déjà en cache
        if (!this.templateCache.has(cleanPath)) {
            await this.loadTemplate(cleanPath);
        }

        // Récupérer le contenu
        const content = this.templateCache.get(cleanPath)!;

        // Trouver tous les includes avec {{ include(...) }}
        const includeFunctionRegex = /\{\{\s*include\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*\{[^}]*\})?\s*\)\s*\}\}/g;
        const includeMatches: string[] = [];
        let match;
        
        includeFunctionRegex.lastIndex = 0;
        while ((match = includeFunctionRegex.exec(content)) !== null) {
            includeMatches.push(match[1]);
        }

        // Trouver les extends
        const extendsRegex = /{%\s*extends\s+['"]([^'"]+)['"]\s*%}/;
        const extendsMatch = content.match(extendsRegex);
        if (extendsMatch) {
            await this.preloadTemplates(extendsMatch[1], new Set(visited));
        }

        // Précharger tous les includes
        for (const includePath of includeMatches) {
            await this.preloadTemplates(includePath, new Set(visited));
        }
    }

    /**
     * Compile un template Twig avec des données
     * Charge et résout manuellement les extends et includes pour éviter l'utilisation de fs
     */
    static async compile(templatePath: string, data: Record<string, any> = {}): Promise<string> {
        try {
            // Configurer les helpers AVANT de résoudre les templates
            // Cela garantit que les fonctions sont disponibles lors de la compilation
            this.configureHelpers();

            // Précharger tous les templates nécessaires dans le cache
            // Cela permet à la fonction include synchrone de fonctionner
            await this.preloadTemplates(templatePath);

            // Résoudre récursivement les extends (mais pas les includes {{ include(...) }} 
            // car ils sont gérés par la fonction include synchrone)
            const resolvedContent = await this.resolveTemplate(templatePath);

            // Créer le template avec twig.js en utilisant data (pas path pour éviter fs)
            // Les fonctions doivent être configurées avant la création du template
            const template = Twig.twig({
                data: resolvedContent,
                rethrow: true,
                autoescape: true,
                // S'assurer que les fonctions sont disponibles
                allowInlineIncludes: false,
            } as any);

            // Rendre le template
            const html = template.render(data);
            return html;
        } catch (error) {
            console.error(`Error compiling template ${templatePath}:`, error);
            // Afficher plus de détails sur l'erreur
            if (error instanceof Error) {
                console.error('Error details:', error.message, error.stack);
            }
            throw error;
        }
    }

    /**
     * Compile un template Twig depuis une chaîne de caractères
     */
    static compileFromString(templateContent: string, data: Record<string, any> = {}): string {
        try {
            this.configureHelpers();

            const template = Twig.twig({
                data: templateContent,
                rethrow: true,
                autoescape: true,
            });

            return template.render(data);
        } catch (error) {
            console.error('Error compiling template from string:', error);
            throw error;
        }
    }

    /**
     * Vide le cache des templates
     */
    static clearCache(): void {
        this.templateCache.clear();
    }
}
