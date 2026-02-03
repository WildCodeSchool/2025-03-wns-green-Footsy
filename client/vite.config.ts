import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
  },
  server: {
    host: "0.0.0.0", // Écoute sur toutes les interfaces réseau
    port: 5173,
    strictPort: true, // Échoue si le port n'est pas disponible
    watch: {
      usePolling: true, // Nécessaire pour Docker - surveille les changements par polling
      interval: 1000, // Intervalle de polling en ms
    },
    hmr: {
      clientPort: 8080, // Port que le client utilise pour se connecter
    },
    proxy: {
      "/graphql": {
        target: "http://backend:4000",
        changeOrigin: true,
      },
    },
  },
});
