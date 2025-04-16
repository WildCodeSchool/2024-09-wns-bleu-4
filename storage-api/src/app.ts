import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fileRoutes from './routes/fileRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Utilisation du router à `/`
app.use('/', fileRoutes);

export default app;
