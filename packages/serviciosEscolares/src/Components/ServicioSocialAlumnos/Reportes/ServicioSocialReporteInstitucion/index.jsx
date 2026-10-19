import React from 'react';
import { Grid } from '@mui/material';
import { DataTable, LabelData } from '@siiges-ui/shared';
import PropTypes from 'prop-types';

const columns = [
  { field: 'programa', headerName: 'Programa', width: 300 },
  { field: 'acuerdoRvoe', headerName: 'RVOE', width: 180 },
  { field: 'nivel', headerName: 'Nivel', width: 150 },
  { field: 'pendiente', headerName: 'Pendiente', width: 130 },
  { field: 'cumplido', headerName: 'Cumplido', width: 130 },
  { field: 'noAplica', headerName: 'No aplica', width: 130 },
  { field: 'total', headerName: 'Total', width: 130 },
];

export default function ServicioSocialReporteInstitucion({ data }) {
  const rows = data?.programas?.map((programa) => ({
    ...programa,
    id: programa.programaId,
  })) || [];

  return (
    <Grid container spacing={2}>
      {data?.institucion && (
        <Grid item xs={6} sx={{ mt: 2 }}>
          <LabelData title="Institución:" subtitle={data.institucion} />
        </Grid>
      )}
      {typeof data?.totalGeneral === 'number' && (
        <Grid item xs={6} sx={{ mt: 2 }}>
          <LabelData
            title="Total de alumnos en servicio social:"
            subtitle={data.totalGeneral.toString()}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <DataTable
          title="Reporte de Servicio Social por Programa"
          columns={columns}
          rows={rows}
        />
      </Grid>
    </Grid>
  );
}

ServicioSocialReporteInstitucion.defaultProps = {
  data: null,
};

ServicioSocialReporteInstitucion.propTypes = {
  data: PropTypes.shape({
    institucion: PropTypes.string,
    totalGeneral: PropTypes.number,
    programas: PropTypes.arrayOf(
      PropTypes.shape({
        programaId: PropTypes.number.isRequired,
        programa: PropTypes.string,
        acuerdoRvoe: PropTypes.string,
        nivel: PropTypes.string,
        pendiente: PropTypes.number,
        cumplido: PropTypes.number,
        noAplica: PropTypes.number,
        total: PropTypes.number,
      }),
    ),
  }),
};
