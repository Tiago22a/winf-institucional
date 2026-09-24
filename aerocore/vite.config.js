import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          aerocore: path.resolve(__dirname, 'aerocore/index.html'),
          neoskin: path.resolve(__dirname, 'neoskin/index.html'),
          winfselect: path.resolve(__dirname, 'winf-select/index.html'),
          ceramicarmoring: path.resolve(__dirname, 'ceramic-armoring/index.html'),
          aeronautica: path.resolve(__dirname, 'aeronautica/index.html'),
          marine: path.resolve(__dirname, 'marine/index.html'),
          supermaquinas: path.resolve(__dirname, 'supermaquinas/index.html'),
          luxo: path.resolve(__dirname, 'luxo/index.html'),
          motorsports: path.resolve(__dirname, 'motorsports/index.html'),
          supermotos: path.resolve(__dirname, 'supermotos/index.html'),
          ghost: path.resolve(__dirname, 'ghost/index.html'),
          phantom: path.resolve(__dirname, 'phantom/index.html'),
          spectre: path.resolve(__dirname, 'spectre/index.html'),
          wraith: path.resolve(__dirname, 'wraith/index.html'),
          bunker: path.resolve(__dirname, 'bunker/index.html'),
          apocalypse: path.resolve(__dirname, 'apocalypse/index.html'),
          ghostliquid: path.resolve(__dirname, 'ghostliquid/index.html'),
          licenciamento: path.resolve(__dirname, 'licenciamento/index.html'),
          policies: path.resolve(__dirname, 'policies/index.html'),
          contato: path.resolve(__dirname, 'contato/index.html'),
        },
      },
    },
  };
});
