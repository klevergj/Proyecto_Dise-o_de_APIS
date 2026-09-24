/**
 * Adapter / Simulador de Buró Externo (Spec 5)
 * 
 * Simula la consulta a un buró crediticio externo (ej. Equifax/TransUnion).
 */

export const consultarScoreBuro = async (identificacion) => {
  // Determinación de score basado en la identificación para pruebas repetibles:
  // - ID termina en '88' -> Reportado en mora en buró externo.
  // - ID termina en '77' -> Score limítrofe (650 pts -> REVISION_MANUAL).
  // - ID termina en '66' -> Score bajo (520 pts -> RECHAZADO por buró).
  // - De lo contrario -> Score óptimo (760 pts -> APROBADO).

  if (identificacion.endsWith('88') || identificacion.startsWith('88')) {
    return {
      identificacion,
      score: 420,
      reportadoEnMora: true
    };
  }

  if (identificacion.endsWith('77') || identificacion.startsWith('77')) {
    return {
      identificacion,
      score: 650,
      reportadoEnMora: false
    };
  }

  if (identificacion.endsWith('66') || identificacion.startsWith('66')) {
    return {
      identificacion,
      score: 520,
      reportadoEnMora: false
    };
  }

  return {
    identificacion,
    score: 760,
    reportadoEnMora: false
  };
};
