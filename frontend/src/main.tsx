import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';
import './style/root.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://backend:4000/',
    cache: new InMemoryCache(),
});

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    </ApolloProvider>
);
