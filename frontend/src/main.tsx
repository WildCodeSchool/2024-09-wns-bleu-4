import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';
import './style/root.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
