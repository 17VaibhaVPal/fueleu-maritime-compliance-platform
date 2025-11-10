import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			'/routes': 'http://localhost:4000',
			'/compliance': 'http://localhost:4000',
			'/banking': 'http://localhost:4000',
			'/pools': 'http://localhost:4000',
		},
	},
});



