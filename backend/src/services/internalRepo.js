/**
 * Simulador de Repositorio Interno de Clientes (Spec 6)
 * 
 * Expone el historial interno de compras, deudas y pagos del cliente.
 */

export const consultarHistorialCliente = async (identificacion) => {
  // Simulación determinista de escenarios basados en la identificación:
  // Si termina o empieza en '99' -> Cliente con mora vigente registrada internamente.
  const tieneMora = identificacion.endsWith('99') || identificacion.startsWith('99');

  return {
    identificacion,
    tieneMoraVigente: tieneMora,
    creditosPrevios: tieneMora ? 2 : 1,
    ingresosDeclarados: tieneMora ? 400.00 : 1500.00,
    antiguedadMeses: tieneMora ? 6 : 24
  };
};
