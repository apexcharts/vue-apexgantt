import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Demo app build configuration for GitHub Pages
export default defineConfig({
  plugins: [vue()],
  // Base path for GitHub Pages
  base: "/vue-apexgantt/",
  build: {
    outDir: "dist-demo",
    emptyOutDir: true,
  },
});
