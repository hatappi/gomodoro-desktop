import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    outDir: '.vite/build',
    sourcemap: true,
    rollupOptions: {
      external: ['electron', 'bufferutil', 'utf-8-validate'],
    },
  },
});
