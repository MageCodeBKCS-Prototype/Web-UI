// Plugins
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueComponents from "unplugin-vue-components/vite";
import { comlink } from "vite-plugin-comlink";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    // Comlink Plugin.
    comlink(),
    // Vue Plugin.
    Vue({
      template: { transformAssetUrls },
    }),
    // Auto import components plugin.
    // Will automatically import components from the "components" dir.
    VueComponents({
      dts: "src/types/imports-components.d.ts",
      dirs: ["src/components"],
    }),
    // Vuetify Plugin.
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
  ],
  worker: {
    plugins: [
      // Comlink Plugin.
      comlink()
    ],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://192.168.60.253:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
  build: {
    target: "esnext"
  }
});
