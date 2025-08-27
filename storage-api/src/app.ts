import express from 'express';
import fileRoutes from './routes/fileRoutes';

const app = express();

// Utilisation du router à `/` 
app.use('/', fileRoutes);

export default app;
