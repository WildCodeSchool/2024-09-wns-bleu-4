import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes';

const app = express();

// Configuration CORS avec le package cors
const corsOptions = {
    origin: [
        'http://localhost:5173', // Frontend en développement local
        'http://localhost:7007', // Via Nginx en local
        'http://frontend:5173',  // Frontend dans Docker
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

// Appliquer le middleware CORS
app.use(cors(corsOptions));

// Utilisation du router à `/` 
app.use('/', fileRoutes);

export default app;
