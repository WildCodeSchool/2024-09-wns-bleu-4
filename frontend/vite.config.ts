import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@public': path.resolve(__dirname, './public'),
        },
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
        setupFiles: './tests.setup.ts',
    },
    css: { postcss: { plugins: [tailwindcss()] } },
} as UserConfig);
