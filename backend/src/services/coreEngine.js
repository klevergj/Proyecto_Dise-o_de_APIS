import { v4 as uuidv4 } from 'uuid';
import { consultarHistorialCliente } from './internalRepo.js';
import { consultarScoreBuro } from './buroSimulator.js';
import { guardarEvaluacion } from './auditStore.js';

/**
 * Servicio Core de Evaluación de Créditos.
 * Orquesta la verificación interna, buró externo y motor de reglas.
 */
export const evaluarSolicitudCredito = async ({ identificacion, montoSolicitado, plazoMeses, tiendaId = 'STORE-POS-01' }) => {
  const idEvaluacion = uuidv4();
  const fecha = new Date().toISOString();
  const reglasAplicadas = [];

  // Paso 1: Consultar Repositorio Interno
  const historialInterno = await consultarHistorialCliente(identificacion);
  reglasAplicadas.push('REGLA_HISTORIAL_INTERNO');

  // Regla Negocio 1: Si posee mora vigente en el sistema interno -> RECHAZADO directo (sin consumir buró)
  if (historialInterno.tieneMoraVigente) {
    const decisionFinal = {
      idEvaluacion,
      decision: 'RECHAZADO',
      motivo: 'Mora vigente en historial interno',
      consultaBuroRealizada: false,
      fecha,
      tiendaId,
      montoSolicitado,
      plazoMeses,
      reglasAplicadas
    };

    guardarEvaluacion(decisionFinal);
    return decisionFinal;
  }

  // Paso 2: Consultar Adapter Buró Externo
  const resultadoBuro = await consultarScoreBuro(identificacion);
  reglasAplicadas.push('REGLA_BURO_EXTERNO');

  let decision = 'RECHAZADO';
  let motivo = '';

  if (resultadoBuro.reportadoEnMora) {
    decision = 'RECHAZADO';
    motivo = 'Cliente reportado en mora en buró crediticio externo';
  } else if (resultadoBuro.score >= 700) {
    decision = 'APROBADO';
    motivo = `Cumple reglas de score (${resultadoBuro.score} pts) y capacidad de pago`;
  } else if (resultadoBuro.score >= 600) {
    decision = 'REVISION_MANUAL';
    motivo = `Score limítrofe (${resultadoBuro.score} pts), requiere validación de un analista`;
  } else {
    decision = 'RECHAZADO';
    motivo = `Score crediticio insuficiente en buró externo (${resultadoBuro.score} pts)`;
  }

  const decisionFinal = {
    idEvaluacion,
    decision,
    motivo,
    consultaBuroRealizada: true,
    fecha,
    tiendaId,
    montoSolicitado,
    plazoMeses,
    scoreBuro: resultadoBuro.score,
    reglasAplicadas
  };

  // Paso 3: Disparar guardado en servicio de auditoría
  guardarEvaluacion(decisionFinal);

  return decisionFinal;
};
