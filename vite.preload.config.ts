import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/preload/preload.ts"),
      formats: ["cjs"],
      fileName: () => "preload.js",
    },
    outDir: ".vite/build",
    sourcemap: true,
    rollupOptions: {
      external: ["electron"],
    },
  },
});
