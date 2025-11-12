import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteSourceLocator } from '@metagptx/vite-plugin-source-locator';

export default defineConfig({
  base: './', // ✅ critical for Netlify
  plugins: [
    viteSourceLocator({ prefix: 'mgx' }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: { usePolling: true, interval: 800 },
  },
});
