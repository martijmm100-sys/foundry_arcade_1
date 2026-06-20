import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base ("./") keeps asset paths correct on Cloudflare Pages
// regardless of the project/preview subpath.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",
  },
});
