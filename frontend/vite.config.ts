import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: {
			"/auth": {
				target: "http://localhost:5000",
				changeOrigin: true,
			},
			"/tasks": {
				target: "http://localhost:5000",
				changeOrigin: true,
			},
			"/socket.io": {
				target: "http://localhost:5000",
				changeOrigin: true,
				ws: true,
			},
		},
	},
});
