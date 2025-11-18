/**
 * Point d'entrée principal de l'application
 * Tout le JavaScript est compilé et géré par Webpack Encore
 */

// ============================================
// Imports CSS
// ============================================
import './styles/app.css';

// ============================================
// Imports de bibliothèques externes
// ============================================
import 'bootstrap';
import '@hotwired/turbo';

// ============================================
// Initialisation Stimulus (si nécessaire)
// ============================================
import { Application } from '@hotwired/stimulus';
const app = Application.start();

// ============================================
// Imports de modules personnalisés
// ============================================
// Protection CSRF pour Symfony (nécessaire pour les formulaires)
import './controllers/csrf_protection.js';

// ============================================
// Code JavaScript de l'application
// ============================================

/**
 * Animation au scroll pour les cartes
 * Ajoute la classe 'animate-in' quand une carte entre dans le viewport
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('.card').forEach((el) => observer.observe(el));
}

/**
 * Initialisation de l'application
 */
function init() {
    // Initialiser les animations au scroll
    initScrollAnimations();

    console.log('S.H.I.E.L.D 2.0 - Vite loaded! 🚀');
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export pour utilisation dans d'autres modules si nécessaire
export { app };
