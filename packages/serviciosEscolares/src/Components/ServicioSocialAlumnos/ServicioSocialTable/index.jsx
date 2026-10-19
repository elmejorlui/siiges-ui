import { DataTable } from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import columnsServicioSocialAlumnos from '../../../Tables/servicioSocialAlumnosTable';

export default function ServicioSocialTable({
  institucion, alumnos, programa, nivel,
}) {
  const [rows, setRows] = useState(alumnos);

  useEffect(() => {
    setRows(alumnos);
  }, [alumnos]);

  const handleEstatusServicioSocialUpdated = (alumnoId, estatusServicioSocialId, estatusNombre) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === alumnoId
      ? {
        ...row,
        estatusServicioSocialId,
        servicioSocial: estatusNombre,
      }
      : row)));
  };

  return (
    <Grid container sx={{ marginTop: 2 }}>
      <DataTable
        rows={rows}
        columns={columnsServicioSocialAlumnos(
          programa,
          institucion,
          nivel,
          handleEstatusServicioSocialUpdated,
        )}
        title="Alumnos de Servicio Social"
      />
    </Grid>
  );
}

ServicioSocialTable.propTypes = {
  alumnos: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number }))
    .isRequired,
  programa: PropTypes.number.isRequired,
  institucion: PropTypes.number.isRequired,
  nivel: PropTypes.number,
};

ServicioSocialTable.defaultProps = {
  nivel: null,
};
