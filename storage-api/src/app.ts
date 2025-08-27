import express from 'express';
import fileRoutes from './routes/fileRoutes';
import tempFileRoutes from './routes/tempFileRoutes';
import { startCleanupService } from './services/cleanupService';

const app = express();

// Start the cleanup service for expired files
startCleanupService();

// Temporary file routes (public, no authentication)
app.use('/', tempFileRoutes);

// Secure file routes (with authentication)
app.use('/', fileRoutes);

export default app;
