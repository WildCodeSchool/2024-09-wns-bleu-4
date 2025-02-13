import React from 'react';
import ReactDOM from 'react-dom/client';
import './root.css';
import './index.css';
import './components/header/header.css';
import './components/background/background.css';
import './components/sidebar/sidebar.css';
import './pages/home/home.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
