/**
 * Servicio de Almacenamiento e Historial de Auditoría (Spec 7)
 * 
 * Guarda y recupera las evaluaciones por idEvaluacion (UUID).
 */

const evaluacionesMap = new Map();

export const guardarEvaluacion = (evaluacion) => {
  evaluacionesMap.set(evaluacion.idEvaluacion, evaluacion);
};

export const obtenerEvaluacionPorId = (id) => {
  return evaluacionesMap.get(id) || null;
};

export const listarTodasLasEvaluaciones = () => {
  return Array.from(evaluacionesMap.values());
};
