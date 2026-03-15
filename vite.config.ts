import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const hmrDisabled = process.env.DISABLE_HMR === 'true';
const pagesBase = '/carhire/';

export default defineConfig(({command}) => ({
  base: command === 'build' ? pagesBase : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        404: path.resolve(__dirname, '404.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    hmr: hmrDisabled
      ? false
      : {
          protocol: 'ws',
          host: 'localhost',
          clientPort: 3000,
          port: 3000,
        },
  },
}));
