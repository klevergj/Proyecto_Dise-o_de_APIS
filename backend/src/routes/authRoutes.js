import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_key_resuelve_openapi_2026';

/**
 * POST /oauth/token
 * Endpoint de autenticación OAuth2 (Client Credentials Flow)
 */
router.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body || {};

  // Opcionalmente validar credenciales si se especifican
  const validClientId = process.env.CLIENT_ID || 'frontend-tiendas';
  const validClientSecret = process.env.CLIENT_SECRET || 'secret-key-resuelve';

  if (grant_type && grant_type !== 'client_credentials') {
    return res.status(400).json({
      codigo: 'GRANT_TYPE_INVALIDO',
      mensaje: 'El parámetro grant_type debe ser client_credentials'
    });
  }

  // Generar JWT Token de acceso
  const payload = {
    client_id: client_id || validClientId,
    scopes: ['evaluaciones:escribir', 'evaluaciones:leer'],
    iss: 'https://auth.resuelve.com'
  };

  const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return res.json({
    access_token,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'evaluaciones:escribir evaluaciones:leer'
  });
});

export default router;
