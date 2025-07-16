import 'dotenv';
import App from '@/App';
import '@/style/root.css';
import ReactDOM from 'react-dom/client';
import './i18n'; // Import i18n configuration

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';

const client = new ApolloClient({
    uri: 'http://localhost:7007/api',
    cache: new InMemoryCache(),
    credentials: 'include', // Important pour les cookies
    credentials: 'include',
});

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

if (
    import.meta.env.VITE_ENVIRONMENT === 'DEV' ||
    !import.meta.env.VITE_ENVIRONMENT
) {
    console.log('App is running in DEV mode');
}

root.render(
    <ApolloProvider client={client}>
        {import.meta.env.VITE_ENVIRONMENT === 'PROD' ? (
            <App />
        ) : (
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )}
    </ApolloProvider>,
);
