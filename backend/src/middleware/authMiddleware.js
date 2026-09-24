import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_key_resuelve_openapi_2026';

/**
 * Middleware para validar Token Bearer OAuth2 en rutas protegidas.
 */
export const verifyOAuthToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      codigo: 'TOKEN_AUSENTE',
      mensaje: 'Token de acceso no proporcionado en la cabecera Authorization (Bearer Token requerido)'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      codigo: 'TOKEN_INVALIDO',
      mensaje: 'Token inválido o expirado'
    });
  }
};
