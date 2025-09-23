import express from 'express';
import fileRoutes from './routes/fileRoutes';
import tempFileRoutes from './routes/tempFileRoutes';
import { startCleanupService } from './services/cleanupService';

const app = express();

// Trust proxy for accurate IP detection (important for rate limiting behind nginx)
app.set('trust proxy', 1);

// Start the cleanup service for expired files
startCleanupService();

// Temporary file routes (public, no authentication)
app.use('/', tempFileRoutes);

// Secure file routes (with authentication)
app.use('/', fileRoutes);

export default app;
