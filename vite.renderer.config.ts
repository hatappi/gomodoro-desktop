import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.vite/renderer',
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
});
