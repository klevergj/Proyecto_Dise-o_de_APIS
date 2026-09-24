import express from 'express';
import { verifyOAuthToken } from '../middleware/authMiddleware.js';
import { evaluarSolicitudCredito } from '../services/coreEngine.js';
import { obtenerEvaluacionPorId } from '../services/auditStore.js';

const router = express.Router();

/**
 * POST /v1/evaluaciones-credito
 * Envía una nueva solicitud de evaluación de crédito.
 */
router.post('/evaluaciones-credito', verifyOAuthToken, async (req, res) => {
  try {
    const { identificacion, montoSolicitado, plazoMeses, tiendaId } = req.body || {};

    // Validaciones de esquema (SolicitudFrontend / SolicitudEvaluacion)
    if (!identificacion || typeof identificacion !== 'string' || !identificacion.trim()) {
      return res.status(400).json({
        codigo: 'IDENTIFICACION_INVALIDA',
        mensaje: 'La identificación es requerida y debe ser un texto válido'
      });
    }

    const numericMonto = parseFloat(montoSolicitado);
    if (isNaN(numericMonto) || numericMonto <= 0) {
      return res.status(400).json({
        codigo: 'MONTO_INVALIDO',
        mensaje: 'El monto solicitado debe ser un valor numérico mayor a 0'
      });
    }

    const numericPlazo = parseInt(plazoMeses, 10);
    if (isNaN(numericPlazo) || numericPlazo <= 0) {
      return res.status(400).json({
        codigo: 'PLAZO_INVALIDO',
        mensaje: 'El plazo en meses debe ser un valor entero mayor a 0'
      });
    }

    // Ejecutar Motor Core
    const resultado = await evaluarSolicitudCredito({
      identificacion: identificacion.trim(),
      montoSolicitado: numericMonto,
      plazoMeses: numericPlazo,
      tiendaId: tiendaId || 'CENTRO-SUR-03'
    });

    // Formatear respuesta según DecisionFrontend (Spec 0 y Gateway Spec 1)
    return res.status(200).json({
      idEvaluacion: resultado.idEvaluacion,
      decision: resultado.decision,
      motivo: resultado.motivo,
      consultaBuroRealizada: resultado.consultaBuroRealizada,
      fecha: resultado.fecha
    });
  } catch (error) {
    console.error('Error interno en evaluacion:', error);
    return res.status(500).json({
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrió un error interno procesando la evaluación de crédito'
    });
  }
});

/**
 * GET /v1/evaluaciones-credito/:id
 * Consulta el estado de una evaluación previa por su UUID.
 */
router.get('/evaluaciones-credito/:id', verifyOAuthToken, (req, res) => {
  const { id } = req.params;

  const evaluacion = obtenerEvaluacionPorId(id);

  if (!evaluacion) {
    return res.status(404).json({
      codigo: 'EVALUACION_NO_ENCONTRADA',
      mensaje: `No existe ninguna evaluación registrada con el ID ${id}`
    });
  }

  return res.status(200).json({
    idEvaluacion: evaluacion.idEvaluacion,
    decision: evaluacion.decision,
    motivo: evaluacion.motivo,
    consultaBuroRealizada: evaluacion.consultaBuroRealizada,
    fecha: evaluacion.fecha
  });
});

export default router;
