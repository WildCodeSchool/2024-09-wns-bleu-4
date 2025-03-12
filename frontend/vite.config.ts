import { defineConfig, UserConfig } from 'vite';
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
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests.setup.ts',
    },
    css: { postcss: { plugins: [tailwindcss()] } }

} as UserConfig);