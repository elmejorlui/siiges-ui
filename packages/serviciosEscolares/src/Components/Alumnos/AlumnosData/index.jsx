import React from 'react';
import {
  Grid, List, Divider,
} from '@mui/material';
import PropTypes from 'prop-types';
import { ListTitle, ListSubtitle } from '@siiges-ui/shared';

export default function AlumnoData({ alumno }) {
  if (!alumno) {
    return <div>Cargando...</div>;
  }

  const opciones = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  };

  const fechaRegistro = alumno.fechaRegistro
    ? new Date(alumno.fechaRegistro).toLocaleDateString('es-MX', opciones)
    : 'N/A';

  const SITUACIONES = {
    1: 'Activo',
    2: 'Inactivo',
    3: 'Egresado',
    4: 'Baja',
  };

  const situacionNombre = alumno?.situacionId
    ? SITUACIONES[alumno.situacionId] || 'Desconocido'
    : 'N/A';

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid container xs={6}>
        <Grid item xs>
          <List>
            <ListTitle text="Matrícula" />
            <ListTitle text="Nombre" />
            <ListTitle text="Apellido Paterno" />
            <ListTitle text="Apellido Materno" />
            <ListTitle text="CURP" />
            <ListTitle text="Situación" />
            <ListTitle text="Fecha de registro" />
          </List>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
        <Grid item xs>
          <List>
            <ListSubtitle text={alumno?.matricula || 'N/A'} />
            <ListSubtitle text={alumno?.nombre || 'N/A'} />
            <ListSubtitle text={alumno?.apellidoPaterno || 'N/A'} />
            <ListSubtitle text={alumno?.apellidoMaterno || 'N/A'} />
            <ListSubtitle text={alumno?.curp || 'N/A'} />
            <ListSubtitle text={situacionNombre} />
            <ListSubtitle text={fechaRegistro} />
          </List>
        </Grid>
      </Grid>
      <Grid container xs={5}>
        <Grid item xs>
          <List>
            <ListTitle text="Celular" />
            <ListTitle text="Correo" />
            <ListTitle text="Teléfono" />
            <ListTitle text="Nacionalidad" />
            <ListTitle text="Género" />
          </List>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
        <Grid item xs>
          <List>
            <ListSubtitle text={alumno?.celular || 'N/A'} />
            <ListSubtitle text={alumno?.correoPrimario || 'N/A'} />
            <ListSubtitle text={alumno?.telefono || 'N/A'} />
            <ListSubtitle text={alumno?.nacionalidad || 'N/A'} />
            <ListSubtitle text={alumno?.sexo || 'N/A'} />
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}

AlumnoData.propTypes = {
  alumno: PropTypes.shape({
    matricula: PropTypes.string,
    nombre: PropTypes.string,
    apellidoPaterno: PropTypes.string,
    apellidoMaterno: PropTypes.string,
    curp: PropTypes.string,
    situacionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fechaRegistro: PropTypes.string,
    celular: PropTypes.string,
    correoPrimario: PropTypes.string,
    telefono: PropTypes.string,
    nacionalidad: PropTypes.string,
    sexo: PropTypes.string,
  }),
};

AlumnoData.defaultProps = {
  alumno: null,
};
