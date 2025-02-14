import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        hmr: { path: '/hmr' },
        allowedHosts: ['frontend'],
    },
    css: { postcss: { plugins: [tailwindcss()] } }
});
