import React, { useContext } from 'react';
import {
  DataTable,
  getData,
  Context,
  ButtonSimple,
} from '@siiges-ui/shared';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import historialColumns from '../../../Tables/historialAlumnosTable';

const url = process.env.NEXT_PUBLIC_URL;

export default function HistorialTable({ alumno }) {
  const { setNoti } = useContext(Context);

  const TIPO_LABEL = Object.freeze({
    1: 'Ordinario',
    2: 'Extraordinario',
  });

  const rows = (alumno ?? [])
    .filter((r) => r && r.asignatura && r.grupo && r.grupo.cicloEscolar)
    .sort((a, b) => (a?.asignaturaId ?? 0)
      - (b?.asignaturaId ?? 0) || (a?.tipo ?? 0) - (b?.tipo ?? 0))
    .map((record) => ({
      id: record.id,
      ciclo: record.grupo.cicloEscolar.nombre,
      clave: record.asignatura.clave,
      seriacion: record.asignatura.seriacion ?? 'N/A',
      asignatura: record.asignatura.nombre,
      tipo: TIPO_LABEL[Number(record.tipo)] ?? '—',
      calificacion: record.calificacion ?? '—',
      fechaExamen: record.fechaExamen ?? '—',
    }));

  const downloadHistorialAcademico = async () => {
    try {
      const alumnoId = alumno?.[0]?.alumnoId;
      if (!alumnoId) {
        setNoti({
          open: true,
          message: 'Sin datos de alumno para descargar.',
          type: 'warning',
        });
        return;
      }

      const response = await getData({
        endpoint: `/files/?tipoEntidad=ALUMNO&entidadId=${alumnoId}&tipoDocumento=HISTORIAL_ACADEMICO`,
      });

      const ubicacion = response?.data?.ubicacion;
      const finalUrl = ubicacion ? `${url}${ubicacion}` : null;

      if (finalUrl && finalUrl !== 'undefined') {
        window.open(finalUrl, '_blank');
      } else {
        setNoti({
          open: true,
          message: '¡Url no válido, intente de nuevo!',
          type: 'error',
        });
      }
    } catch {
      setNoti({
        open: true,
        message: '¡Error al descargar el archivo!',
        type: 'error',
      });
    }
  };

  return (
    <Grid container sx={{ marginTop: 2 }}>
      <Grid item xs={12}>
        <ButtonSimple
          onClick={downloadHistorialAcademico}
          text="Descargar"
          align="left"
          design="guardar"
        />
      </Grid>
      <DataTable rows={rows} columns={historialColumns} title="Historial del Alumno" />
    </Grid>
  );
}

HistorialTable.propTypes = {
  alumno: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      alumnoId: PropTypes.number.isRequired,
      grupo: PropTypes.shape({
        cicloEscolar: PropTypes.shape({
          nombre: PropTypes.string,
        }),
      }),
      asignatura: PropTypes.shape({
        clave: PropTypes.string,
        seriacion: PropTypes.string,
        nombre: PropTypes.string,
      }),
      tipo: PropTypes.number.isRequired,
      calificacion: PropTypes.string.isRequired,
      fechaExamen: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
