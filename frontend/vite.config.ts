import { defineConfig, UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
        }
    },
    plugins: [react()],
    server: {
        host: true,
        hmr: { path: '/hmr' },
        allowedHosts: ['frontend'],
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest-setup.ts',
    },
    css: { postcss: { plugins: [tailwindcss()] } }

} as UserConfig);