import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - en dev se puede permitir localhost explícito
app.use(cors({
  origin: 'http://localhost:3000', // o true para permitir cualquier origen en dev
  credentials: true
}));

// servir archivos estáticos - mapeamos toda la carpeta frontend (útil)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPages = path.join(__dirname, '..', 'frontend', 'pages');

// servir /pages/* tal como tenías
app.use('/pages', express.static(frontendPages));

// servir la raíz '/' con index.html para facilitar abrir http://localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPages, 'index.html'));
});

// opcional: si quieres que cualquier ruta no API devuelva index.html (SPA fallback)
app.get(/^\/(?!api).*/, (req, res, next) => {
  // si la petición ya fue para /pages/..., dejar que express.static la maneje
  // pero si no, servimos index.html para que el front maneje el enrutamiento
  if (req.path.startsWith('/pages') || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPages, 'index.html'));
});

// rutas API
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

// registro simple de peticiones para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
