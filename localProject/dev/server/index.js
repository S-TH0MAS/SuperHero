/**
 * Serveur Express pour le développement
 * Sert uniquement les fichiers statiques (CSV, uploads, templates Twig)
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const symfonyRoot = resolve(rootDir, '../..');
const symfonyPublic = join(symfonyRoot, 'public');
const symfonyTemplates = join(symfonyRoot, 'templates');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Servir les fichiers CSV depuis le dossier data
app.use('/data', express.static(join(rootDir, 'data')));

// Servir les uploads depuis Symfony
app.use('/uploads', express.static(join(symfonyPublic, 'uploads')));

// Servir les templates Twig depuis Symfony
app.use('/templates', express.static(symfonyTemplates, {
  setHeaders: (res, path) => {
    if (path.endsWith('.twig')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
  },
}));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
  console.log(`📁 Servant les fichiers statiques depuis: ${rootDir}`);
  console.log(`📦 Uploads Symfony: ${symfonyPublic}/uploads`);
  console.log(`🎨 Templates Twig: ${symfonyTemplates}`);
});
