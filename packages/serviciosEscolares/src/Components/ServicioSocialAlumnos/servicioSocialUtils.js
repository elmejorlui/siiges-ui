export const TIPOS_DOCUMENTO_SERVICIO_SOCIAL = [
  {
    tipoDocumento: 'ARCHIVO_CARTA_ASIGNACION',
    label: 'Carta de asignación (PDF)',
  },
  {
    tipoDocumento: 'ARCHIVO_INFORME_FINAL',
    label: 'Informe final (PDF)',
  },
  {
    tipoDocumento: 'ARCHIVO_CARTA_LIBERACION',
    label: 'Carta de liberación (PDF)',
  },
];

export const ESTATUS_SERVICIO_SOCIAL = {
  PENDIENTE: { id: 1, nombre: 'Pendiente' },
  CUMPLIDO: { id: 2, nombre: 'Cumplido' },
  NO_APLICA: { id: 3, nombre: 'No aplica' },
};

/* Niveles de estudios en los que NO aplica el servicio social.
 * 4: Especialidad, 5: Maestría, 6: Doctorado. */
export const NIVELES_SERVICIO_SOCIAL_NO_APLICA = [4, 5, 6];

export const puedeMarcarNoAplica = (nivelId) => (
  NIVELES_SERVICIO_SOCIAL_NO_APLICA.includes(Number(nivelId))
);

export const opcionesEstatusServicioSocial = (nivelId) => [
  ESTATUS_SERVICIO_SOCIAL.PENDIENTE,
  ESTATUS_SERVICIO_SOCIAL.CUMPLIDO,
  ...(puedeMarcarNoAplica(nivelId) ? [ESTATUS_SERVICIO_SOCIAL.NO_APLICA] : []),
];

export const getEstatusNombre = (estatusId) => {
  const estatus = Object.values(ESTATUS_SERVICIO_SOCIAL)
    .find((option) => option.id === Number(estatusId));
  return estatus?.nombre || ESTATUS_SERVICIO_SOCIAL.PENDIENTE.nombre;
};
