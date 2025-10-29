import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0', // Écoute sur toutes les interfaces réseau
		port: 5173,
		strictPort: true, // Échoue si le port n'est pas disponible
		watch: {
			usePolling: true, // Nécessaire pour Docker - surveille les changements par polling
			interval: 1000, // Intervalle de polling en ms
		},
		hmr: {
			host: 'localhost', // Host pour le Hot Module Replacement
			port: 5173,
		}
	}
});
