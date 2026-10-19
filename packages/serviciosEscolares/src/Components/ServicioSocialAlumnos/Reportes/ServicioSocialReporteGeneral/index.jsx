import React from 'react';
import { Grid } from '@mui/material';
import { DataTable, LabelData } from '@siiges-ui/shared';
import PropTypes from 'prop-types';

const columns = [
  { field: 'institucion', headerName: 'Institución', width: 400 },
  { field: 'pendiente', headerName: 'Pendiente', width: 150 },
  { field: 'cumplido', headerName: 'Cumplido', width: 150 },
  { field: 'noAplica', headerName: 'No aplica', width: 150 },
  { field: 'total', headerName: 'Total', width: 150 },
];

export default function ServicioSocialReporteGeneral({ data }) {
  const rows = data?.instituciones?.map((institucion) => ({
    ...institucion,
    id: institucion.institucionId,
  })) || [];

  return (
    <Grid container spacing={2}>
      {typeof data?.totalGeneral === 'number' && (
        <Grid item xs={12} sx={{ mt: 2 }}>
          <LabelData
            title="Total de alumnos en servicio social:"
            subtitle={data.totalGeneral.toString()}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <DataTable
          title="Reporte General de Servicio Social"
          columns={columns}
          rows={rows}
        />
      </Grid>
    </Grid>
  );
}

ServicioSocialReporteGeneral.defaultProps = {
  data: null,
};

ServicioSocialReporteGeneral.propTypes = {
  data: PropTypes.shape({
    totalGeneral: PropTypes.number,
    instituciones: PropTypes.arrayOf(
      PropTypes.shape({
        institucionId: PropTypes.number.isRequired,
        institucion: PropTypes.string,
        pendiente: PropTypes.number,
        cumplido: PropTypes.number,
        noAplica: PropTypes.number,
        total: PropTypes.number,
      }),
    ),
  }),
};
