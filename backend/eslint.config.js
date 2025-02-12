import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    {
        ignores: ['dist', 'node_modules'], // Ignore les dossiers de build et node_modules
    },
    {
        files: ['**/*.ts'], // Lint uniquement les fichiers TypeScript
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: globals.node, // Ajoute les globals Node.js (comme process, __dirname)
            parser: parserTs, // Utilise le parser TypeScript
        },
        plugins: {
            '@typescript-eslint': pluginTs, // Charge le plugin TypeScript
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn'], // Alerte pour les variables inutilisées
            '@typescript-eslint/explicit-function-return-type': 'off', // Pas besoin de typer explicitement les retours de fonction
        },
    },
];
