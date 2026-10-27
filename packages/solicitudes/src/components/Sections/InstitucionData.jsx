import { Grid, Typography } from '@mui/material';
import { GetFile, Input, InputFile } from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DatosGeneralesContext from '../utils/Context/datosGeneralesContext';
import formDatosSolicitud from '../utils/sections/forms/formDatosSolicitud';
import useSectionDisabled from './Hooks/useSectionDisabled';

function InstitucionData({ id, disabled }) {
  const {
    setDisabled, form, setForm, institucion,
  } = useContext(DatosGeneralesContext);

  const [fileUrl, setFileUrl] = useState();
  const [justificacionUrl, setJustificacionUrl] = useState();

  const fileData = {
    entidadId: id,
    tipoEntidad: 'INSTITUCION',
    tipoDocumento: 'LOGOTIPO',
  };

  const justificacionData = {
    entidadId: id,
    tipoEntidad: 'INSTITUCION',
    tipoDocumento: 'JUSTIFICACION_NOMBRE',
  };

  const isSectionDisabled = useSectionDisabled(11);

  const isDisabled = disabled || isSectionDisabled;

  useEffect(() => {
    if (id !== undefined) {
      setDisabled(false);
    }
    GetFile(fileData, setFileUrl);
    GetFile(justificacionData, setJustificacionUrl);
  }, [id]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    formDatosSolicitud(name, value, form, setForm, 1);
  };

  if (!institucion) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos de la institución</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={3}>
          <Input
            id="razonSocial"
            label="Razón social"
            name="razonSocial"
            auto="razonSocial"
            onChange={handleOnChange}
            value={institucion?.razonSocial}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={9}>
          <Input
            id="nombre"
            label="Nombre de la institución"
            name="nombre"
            auto="nombre"
            onChange={handleOnChange}
            value={institucion.nombre}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="historia"
            name="historia"
            label="Historia"
            rows={4}
            multiline
            sx={{ width: '100%' }}
            value={institucion.historia}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="vision"
            name="vision"
            label="Visión"
            rows={4}
            multiline
            sx={{ width: '100%' }}
            value={institucion?.vision}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="mision"
            name="mision"
            label="Misión"
            rows={4}
            multiline
            sx={{ width: '100%' }}
            value={institucion?.mision}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="valoresInstitucionales"
            name="valoresInstitucionales"
            label="Valores institucionales"
            rows={4}
            multiline
            sx={{ width: '100%' }}
            value={institucion?.valoresInstitucionales}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="INSTITUCION"
            tipoDocumento="LOGOTIPO"
            id={id}
            label="Logo de la institución"
            url={fileUrl}
            setUrl={setFileUrl}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="INSTITUCION"
            tipoDocumento="JUSTIFICACION_NOMBRE"
            id={id}
            label="Justificación de nombre"
            url={justificacionUrl}
            setUrl={setJustificacionUrl}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

InstitucionData.defaultProps = {
  disabled: false,
};

InstitucionData.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([undefined]),
  ]).isRequired,
  disabled: PropTypes.bool,
};

export default InstitucionData;
