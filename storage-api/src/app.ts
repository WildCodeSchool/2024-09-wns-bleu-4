import express from 'express';
import fileRoutes from './routes/fileRoutes';
import tempFileRoutes from './routes/tempFileRoutes';

const app = express();

// Temporary file routes (public, no authentication)
app.use('/', tempFileRoutes);

// Secure file routes (with authentication)
app.use('/', fileRoutes);

export default app;
