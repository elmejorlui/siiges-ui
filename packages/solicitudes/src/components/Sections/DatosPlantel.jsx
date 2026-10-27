import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@mui/material';
import { Input, usePlantel } from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import getPlantelesUsuario from '../utils/getPlantelesUsuario';
import formPrograma from '../utils/sections/forms/formPrograma';
import useSectionDisabled from './Hooks/useSectionDisabled';

export default function DatosPlantel({
  disabled: initialDisabled,
  plantelesData,
  setPlantelesData,
  usuarioId,
  type,
}) {
  const { planteles } = getPlantelesUsuario(usuarioId);
  const { setForm, plantelId } = usePlantel();
  const [plantelesSelect, setPlantelesSelect] = useState([]);
  const [disabled, setDisabled] = useState(initialDisabled);

  useEffect(() => {
    if (type === 'editar') {
      setDisabled(!initialDisabled);
    } else {
      setDisabled(initialDisabled);
    }
  }, [type]);

  const isSectionDisabled = useSectionDisabled(14);

  const isDisabled = disabled || isSectionDisabled;

  useEffect(() => {
    if (planteles) {
      const mappedPlanteles = planteles.map(({ id, domicilio }) => ({
        id,
        nombre: `${domicilio.calle} ${domicilio.numeroExterior}`,
      }));
      setPlantelesSelect(mappedPlanteles);
    }
  }, [planteles]);

  useEffect(() => {
    if (plantelId !== null && planteles) {
      const selectedPlantel = planteles.find(
        (plantel) => plantel.id === plantelId,
      );
      if (selectedPlantel) {
        setPlantelesData((prevData) => ({
          ...prevData,
          ...selectedPlantel,
          plantelId: plantelId.toString(),
        }));
      }
    }
  }, [plantelId, planteles]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    formPrograma(name, value, setForm, 1);
    if (value) {
      const selectedPlantel = planteles.find(
        (plantel) => plantel.id === Number(value),
      );
      setPlantelesData((prevData) => ({
        ...prevData,
        plantelId: value,
        ...selectedPlantel,
      }));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos del Plantel</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={8}>
          <BasicSelect
            title="Plantel"
            name="plantelId"
            options={plantelesSelect}
            value={plantelId || ''}
            onChange={handleOnChange}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="claveCentroTrabajo"
            label="Clave de centro de trabajo"
            name="claveCentroTrabajo"
            auto="claveCentroTrabajo"
            value={type === 'editar' ? '' : plantelesData?.claveCentroTrabajo}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="telefono1"
            label="Teléfono 1"
            name="telefono1"
            auto="telefono1"
            value={plantelesData?.telefono1}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="telefono2"
            label="Teléfono 2"
            name="telefono2"
            auto="telefono2"
            value={plantelesData?.telefono2}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="telefono3"
            label="Teléfono 3"
            name="telefono3"
            auto="telefono3"
            value={plantelesData?.telefono3}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="correo1"
            label="Correo Electrónico Institucional"
            name="correo1"
            auto="correo1"
            value={plantelesData?.correo1}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="paginaWeb"
            label="Página web"
            name="paginaWeb"
            auto="paginaWeb"
            value={plantelesData?.paginaWeb}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="correo2"
            label="Correo electrónico sin dominio 1"
            name="correo2"
            auto="correo2"
            value={plantelesData?.correo2}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="correo3"
            label="Correo electrónico sin dominio 2"
            name="correo3"
            auto="correo3"
            value={plantelesData?.correo3}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="redesSociales"
            label="Redes sociales"
            name="redesSociales"
            auto="redesSociales"
            rows={3}
            multiline
            value={plantelesData?.redesSociales}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Ubicación del Plantel</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={6}>
          <Input
            id="calle"
            label="Calle"
            name="calle"
            auto="calle"
            value={plantelesData?.domicilio?.calle}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="numeroExterior"
            label="Número exterior"
            name="numeroExterior"
            auto="numeroExterior"
            value={plantelesData?.domicilio?.numeroExterior}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="numeroInterior"
            label="Número interor"
            name="numeroInterior"
            auto="numeroInterior"
            value={plantelesData?.domicilio?.numeroInterior}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="colonia"
            label="Colonia"
            name="colonia"
            auto="colonia"
            value={plantelesData?.domicilio?.colonia}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="codigoPostal"
            label="Código Postal"
            name="codigoPostal"
            auto="codigoPostal"
            value={plantelesData?.domicilio?.codigoPostal}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="nombre"
            label="Municipio"
            name="municipio"
            auto="municipio"
            value={plantelesData?.domicilio?.municipio?.nombre}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="longitud"
            label="Coordenadas"
            name="longitud"
            auto="longitud"
            value={`${plantelesData?.domicilio?.latitud}, ${plantelesData?.domicilio?.longitud}`}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="especificaciones"
            label="Especificaciones"
            rows={4}
            multiline
            sx={{ width: '100%' }}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

DatosPlantel.defaultProps = {
  usuarioId: null,
};

DatosPlantel.propTypes = {
  disabled: PropTypes.bool.isRequired,
  usuarioId: PropTypes.number,
  plantelesData: PropTypes.shape({
    claveCentroTrabajo: PropTypes.string,
    telefono1: PropTypes.string,
    telefono2: PropTypes.string,
    telefono3: PropTypes.string,
    correo1: PropTypes.string,
    paginaWeb: PropTypes.string,
    correo2: PropTypes.string,
    redesSociales: PropTypes.string,
    type: PropTypes.string,
    correo3: PropTypes.string,
    domicilio: PropTypes.shape({
      calle: PropTypes.string,
      numeroExterior: PropTypes.string,
      numeroInterior: PropTypes.string,
      colonia: PropTypes.string,
      codigoPostal: PropTypes.number,
      municipio: PropTypes.shape({
        nombre: PropTypes.string,
      }),
      latitud: PropTypes.string,
      longitud: PropTypes.string,
    }),
  }).isRequired,
  setPlantelesData: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['crear', 'editar']).isRequired,
};
