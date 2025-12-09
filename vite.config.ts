import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/**/*.spec.ts", "demo/**/*"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueApexGantt",
      fileName: (format) => `vue-apexgantt.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "apexgantt"],
      output: {
        globals: {
          vue: "Vue",
          apexgantt: "ApexGantt",
        },
      },
    },
  },
});
