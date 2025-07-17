import 'dotenv';
import App from '@/App';
import '@/style/root.css';
import ReactDOM from 'react-dom/client';
import './i18n'; // Import i18n configuration

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';

const getApiUri = () => {
    switch (import.meta.env.VITE_ENVIRONMENT) {
        case "PROD":
            return "https://wildtransfer.cloud/api";
        case "STAGING":
            return "https://staging.wildtransfer.cloud/api";
        case "DEV":
            return "http://localhost:7007/api";
        default:
            throw new Error(`Invalid VITE_ENVIRONMENT value: ${import.meta.env.VITE_ENVIRONMENT ?? 'MISSING VALUE'}`);
    }
};

const client = new ApolloClient({
    uri: getApiUri(),
    cache: new InMemoryCache(),
    credentials: 'include',
});

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

console.log('App is running in', import.meta.env.VITE_ENVIRONMENT, 'mode');

const renderApp = () => {
    switch (import.meta.env.VITE_ENVIRONMENT) {
        case "PROD":
            return <App />;
        default:
            return (
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            );
    }
};

root.render(
    <ApolloProvider client={client}>
        {renderApp()}
    </ApolloProvider>
);
