import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import evaluacionRoutes from './routes/evaluacionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logueo de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas de la API (OAuth2 y Evaluaciones)
app.use('/oauth', authRoutes);
app.use('/v1', evaluacionRoutes);

// Ruta de Salud / Status
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Resuelve API Gateway & Evaluador', timestamp: new Date().toISOString() });
});

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    codigo: 'RECURSO_NO_ENCONTRADO',
    mensaje: `La ruta ${req.method} ${req.url} no existe en este servidor`
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Resuelve Backend iniciado en el puerto ${PORT}`);
  console.log(`🔑 OAuth Token URL: http://localhost:${PORT}/oauth/token`);
  console.log(`📋 Evaluation URL: http://localhost:${PORT}/v1/evaluaciones-credito`);
  console.log(`====================================================`);
});
