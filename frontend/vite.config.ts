import tailwindcss from '@tailwindcss/vite';
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
    plugins: [react(), tailwindcss()],
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
} as UserConfig);
