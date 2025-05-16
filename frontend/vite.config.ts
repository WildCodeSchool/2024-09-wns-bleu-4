import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, UserConfig, loadEnv } from 'vite';

import 'dotenv/config';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
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
            setupFiles: './vitest-setup.ts',
        },
        define: {
            'process.env.VITE_ENVIRONMENT': JSON.stringify(
                env.VITE_ENVIRONMENT,
            ),
        },
    } as UserConfig;

});
