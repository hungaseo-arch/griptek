import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// CV Graiptek Business Forms — Vue 3 migration.
// Note: the React project used `lovable-tagger` (visual-editor tagging plugin).
// It is React-specific and intentionally omitted — see MIGRATION.md §5.
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
