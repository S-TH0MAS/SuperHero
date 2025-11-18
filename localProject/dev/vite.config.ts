import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Chemins vers le projet Symfony parent
const symfonyRoot = resolve(__dirname, '../..');
const symfonyTemplates = join(symfonyRoot, 'templates');
const symfonyStyles = join(symfonyRoot, 'assets/styles');
const symfonyPublic = join(symfonyRoot, 'public');

// Plugin pour copier les CSV dans le build
const copyDataPlugin = () => {
  return {
    name: 'copy-data',
    writeBundle() {
      const dataDir = resolve(__dirname, 'data');
      const distDataDir = resolve(__dirname, 'dist/data');
      
      try {
        mkdirSync(distDataDir, { recursive: true });
        const files = readdirSync(dataDir);
        
        files.forEach(file => {
          const src = join(dataDir, file);
          const dest = join(distDataDir, file);
          if (statSync(src).isFile()) {
            copyFileSync(src, dest);
            console.log(`✅ Copié: ${file}`);
          }
        });
      } catch (error) {
        console.error('❌ Erreur lors de la copie des CSV:', error);
      }
    },
  };
};

export default defineConfig({
  root: './src',
  publicDir: '../public',
  css: {
    preprocessorOptions: {
      scss: {
        // Silencer les warnings de dépréciation
        silenceDeprecations: ['legacy-js-api'],
        // Les imports se font directement dans styles.scss
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Alias pour accéder aux styles Symfony
      '@symfony-styles': symfonyStyles,
      // Alias pour accéder aux templates Symfony
      '@symfony-templates': symfonyTemplates,
      // Alias pour accéder aux assets publics Symfony
      '@symfony-public': symfonyPublic,
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
    assetsInlineLimit: 0,
  },
  plugins: [
    copyDataPlugin(),
    // Copier les uploads depuis Symfony
    viteStaticCopy({
      targets: [
        {
          src: join(symfonyPublic, 'uploads/heroes/*'),
          dest: 'uploads/heroes',
        },
      ],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy pour les fichiers CSV
      '/data': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy pour les uploads Symfony
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy pour les templates Twig
      '/templates': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    // Servir les fichiers depuis le projet Symfony
    fs: {
      allow: [
        // Permettre l'accès au dossier du projet
        resolve(__dirname, '..'),
        // Permettre l'accès au projet Symfony
        symfonyRoot,
      ],
    },
  },
});
