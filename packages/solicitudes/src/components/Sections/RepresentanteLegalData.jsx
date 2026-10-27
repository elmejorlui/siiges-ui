import { Grid, Typography } from '@mui/material';
import {
  GetFile, Input, InputFile,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import getMunicipios from '@siiges-ui/instituciones/src/components/utils/getMunicipios';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import DatosGeneralesContext from '../utils/Context/datosGeneralesContext';
import formDatosRepresentante from '../utils/sections/forms/formDatosRepresentante';
import useSectionDisabled from './Hooks/useSectionDisabled';
import getUsuarioById from '../utils/getUserById';

function RepresentanteLegalData({ id, disabled }) {
  const {
    setDisabled, form, setForm, solicitud,
  } = useContext(DatosGeneralesContext);

  const { municipios } = getMunicipios();
  const { user } = getUsuarioById(solicitud?.usuarioId);
  const [fileUrl, setFileUrl] = useState();
  const fileData = {
    entidadId: solicitud.usuarioId,
    tipoEntidad: 'REPRESENTANTE',
    tipoDocumento: 'FIRMA_REPRESENTANTE',
  };

  useEffect(() => {
    GetFile(fileData, setFileUrl);
  }, []);

  const isSectionDisabled = useSectionDisabled(12);

  const isDisabled = disabled || isSectionDisabled;

  useEffect(() => {
    if (id !== undefined) {
      setDisabled(false);
    }
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        2: {
          ...prevForm[2],
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          persona: {
            telefono: user.persona.telefono,
            celular: user.persona.celular,
            apellidoPaterno: user.persona.apellidoPaterno,
            apellidoMaterno: user.persona.apellidoMaterno,
            nacionalidad: user.persona.nacionalidad,
            domicilio: {
              calle: user.persona.domicilio.calle,
              numeroExterior: user.persona.domicilio.numeroExterior,
              numeroInterior: user.persona.domicilio.numeroInterior,
              colonia: user.persona.domicilio.colonia,
              codigoPostal: user.persona.domicilio.codigoPostal,
              municipioId: user.persona.domicilio.municipioId,
              estadoId: user.persona.domicilio.estadoId,
            },
          },
        },
      }));
    }
  }, [id, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    formDatosRepresentante(name, value, form, setForm, 2);
  };

  if (!user) {
    return null;
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos de Representante legal</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={6}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            value={user?.persona?.nombre}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="apellidoPaterno"
            label="Primer Apellido"
            name="apellidoPaterno"
            auto="apellidoPaterno"
            value={user?.persona?.apellidoPaterno}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="apellidoMaterno"
            label="Segundo Apellido"
            name="apellidoMaterno"
            auto="apellidoMaterno"
            value={user?.persona?.apellidoMaterno}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="nacionalidad"
            label="Nacionalidad"
            name="nacionalidad"
            auto="nacionalidad"
            value={user?.persona?.nacionalidad}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="calle"
            label="Calle"
            name="calle"
            auto="calle"
            value={user?.persona?.domicilio?.calle}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="numeroExterior"
            label="Número exterior"
            name="numeroExterior"
            auto="numeroExterior"
            value={user?.persona?.domicilio?.numeroExterior}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="numeroInterior"
            label="Número interior"
            name="numeroInterior"
            auto="numeroInterior"
            value={user?.persona?.domicilio?.numeroInterior}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="colonia"
            label="Colonia"
            name="colonia"
            auto="colonia"
            value={user?.persona?.domicilio?.colonia}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="codigoPostal"
            label="Código Postal"
            name="codigoPostal"
            auto="codigoPostal"
            value={user?.persona?.domicilio?.codigoPostal}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <BasicSelect
            title="Municipio"
            name="municipioId"
            value={user?.persona?.domicilio?.municipio?.id}
            options={municipios}
            onChange={handleOnChange}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="correo"
            label="Correo"
            name="correo"
            auto="correo"
            value={user?.correo}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="telefono"
            label="Teléfono"
            name="telefono"
            auto="telefono"
            value={user?.persona?.telefono}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="celular"
            label="Celular"
            name="celular"
            auto="celular"
            value={user?.persona?.celular}
            disabled={isDisabled}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="REPRESENTANTE"
            tipoDocumento="FIRMA_REPRESENTANTE"
            id={solicitud.usuarioId}
            label="Subir firma"
            url={fileUrl}
            setUrl={setFileUrl}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

RepresentanteLegalData.defaultProps = {
  disabled: false,
};

RepresentanteLegalData.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([undefined])]).isRequired,
  disabled: PropTypes.bool,
};

export default RepresentanteLegalData;
