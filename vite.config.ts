import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import sveltePreprocess from "svelte-preprocess";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [
        sveltePreprocess({
          typescript: true,
        }),
      ],
    })
  ],

  resolve: {
    alias: {
      "@interactables": resolve(__dirname, "./src/components/interactables"),
      "@layout": resolve(__dirname, "./src/components/layout"),
      "@component-utils": resolve(__dirname, "./src/components/utils"),
      "@directives": resolve(__dirname, "./src/lib/directives"),
      "@utils": resolve(__dirname, "./src/lib/utils"),
      "@types": resolve(__dirname, "./src/lib/types"),
      "@icons": resolve(__dirname, "./src/lib/icons")
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari15",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,

    rollupOptions: {
      input: {
        // @ts-ignore
        main: resolve(__dirname, 'src/index.html')
      }
    },
  },
  define: {
    'APP_VERSION': JSON.stringify(process.env.npm_package_version),
  }
});
