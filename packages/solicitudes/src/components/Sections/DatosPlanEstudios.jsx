import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { ButtonSimple, DefaultModal, Input } from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import PropTypes from 'prop-types';
import errorDatosPlanEstudios from '../utils/sections/errors/errorDatosPlanEstudios';
import SolicitudContext from '../utils/Context/solicitudContext';
import formDatosPlanEstudios from '../utils/sections/forms/formDatosPlanEstudios';
import useSectionDisabled from './Hooks/useSectionDisabled';
import modalidades from '../utils/Mocks/mockModalidades';

export default function DatosPlanEstudios({ disabled, type, tipoSolicitudId }) {
  const [initialValues, setInitialValues] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (type !== 'editar' && type !== 'consultar') {
      setOpen(true);
    }
  }, []);

  const {
    form, setForm, error, setError, setErrors,
  } = useContext(SolicitudContext);
  const isSectionDisabled = useSectionDisabled(1);

  const isDisabled = disabled || isSectionDisabled;

  const handleOnChange = (e) => {
    const { name, value } = e?.target || {};
    if (name && value !== undefined) {
      formDatosPlanEstudios(name, value, form, setForm);
    }
  };

  const errors = useMemo(
    () => errorDatosPlanEstudios(form, setError, error),
    [form, setError, error],
  );

  const handleOnBlur = (e) => {
    const { name, value } = e?.target || {};
    if (name && value !== undefined) {
      const initialValue = initialValues[name];
      if (value !== initialValue || value === '') {
        errors[name]?.();
      }
    }
  };

  const handleInputFocus = (e) => {
    const { name, value } = e?.target || {};
    if (name) {
      setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    }
  }, [setErrors]);

  const antecedenteAcademico = [
    { id: 1, nombre: 'Bachillerato' },
    { id: 2, nombre: 'Licenciatura' },
    { id: 3, nombre: 'Técnico Superior Universitario' },
    { id: 4, nombre: 'Especialidad' },
    { id: 5, nombre: 'Maestria' },
    { id: 6, nombre: 'Doctorado' },
    { id: 7, nombre: 'Profesional Asociado' },
    { id: 8, nombre: 'Educación Continua' },
  ];

  const nivel = [
    { id: 2, nombre: 'Licenciatura' },
    { id: 3, nombre: 'Técnico Superior Universitario' },
    { id: 4, nombre: 'Especialidad' },
    { id: 5, nombre: 'Maestria' },
    { id: 6, nombre: 'Doctorado' },
    { id: 7, nombre: 'Profesional Asociado' },
    { id: 8, nombre: 'Educación Continua' },
  ];

  const periodo = [
    { id: 1, nombre: 'Semestral' },
    { id: 2, nombre: 'Cuatrimestral' },
    { id: 3, nombre: 'Anual' },
    { id: 4, nombre: 'Semestral curriculum flexible' },
    { id: 5, nombre: 'Cuatrimestral curriculum flexible' },
  ];

  const turno = [
    { id: 1, nombre: 'Matutino' },
    { id: 2, nombre: 'Vespertino' },
    { id: 3, nombre: 'Nocturno' },
    { id: 4, nombre: 'Mixto' },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos del plan de estudios</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={3}>
          <BasicSelect
            title="Nivel"
            name="nivelId"
            options={nivel}
            value={form[1].programa?.nivelId || ''}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.nivelId}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={9}>
          <Input
            id="nombre"
            label="Nombre del programa de estudio"
            name="nombre"
            auto="nombre"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            value={form[1].programa?.nombre || ''}
            errorMessage={error.nombre}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <BasicSelect
            title="Modalidad"
            name="modalidadId"
            value={form[1].programa?.modalidadId || ''}
            options={modalidades}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.modalidadId}
            disabled
          />
        </Grid>
        <Grid item xs={3}>
          <BasicSelect
            title="Periodo"
            name="cicloId"
            value={form[1].programa?.cicloId || ''}
            options={periodo}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.cicloId}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <BasicSelect
            title="Turno"
            name="programaTurnos"
            options={turno}
            multiple
            value={form[1].programa?.programaTurnos || []}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.programaTurnos}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="duracionPeriodos"
            label="Duración del programa"
            name="duracionPeriodos"
            auto="duracionPeriodos"
            onChange={handleOnChange}
            value={form[1].programa?.duracionPeriodos || ''}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.duracionPeriodos}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3} sx={{ mt: 3 }}>
          <Typography>Periodos</Typography>
        </Grid>
        <Grid item xs={6}>
          <Input
            id="creditos"
            label="Créditos necesarios para concluir el programa"
            name="creditos"
            auto="creditos"
            value={form[1].programa?.creditos}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.creditos}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <BasicSelect
            title="Nivel Previo"
            name="antecedenteAcademico"
            options={antecedenteAcademico}
            value={
              Number.isInteger(form[1].programa?.antecedenteAcademico)
                ? form[1].programa?.antecedenteAcademico
                : parseInt(form[1].programa?.antecedenteAcademico || '', 10) || ''
            }
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.antecedenteAcademico}
            required
            disabled={isDisabled}
          />
        </Grid>
        {tipoSolicitudId !== 3 && (
          <>
            <Grid item xs={12}>
              <TextField
                label="Objetivo General"
                id="objetivoGeneral"
                name="objetivoGeneral"
                auto="objetivoGeneral"
                value={form[1].programa?.objetivoGeneral || ''}
                rows={4}
                multiline
                sx={{ width: '100%' }}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={handleInputFocus}
                helperText={error.objetivoGeneral}
                error={!!error.objetivoGeneral}
                required
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Objetivo Particular"
                id="objetivosParticulares"
                name="objetivosParticulares"
                auto="objetivosParticulares"
                value={form[1].programa?.objetivosParticulares || ''}
                rows={4}
                multiline
                sx={{ width: '100%' }}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={handleInputFocus}
                helperText={error.objetivosParticulares}
                error={!!error.objetivosParticulares}
                required
                disabled={isDisabled}
              />
            </Grid>
          </>
        )}
      </Grid>
      <DefaultModal title="Recordatorio" open={open} setOpen={setOpen}>
        Estimada Institución, recuerda que la fecha oficial de recepción de la solicitud será al
        momento de la entrega de la documentación en físico
        <ButtonSimple onClick={() => { setOpen(false); }} text="Entendido" align="right" />
      </DefaultModal>
    </Grid>
  );
}

DatosPlanEstudios.defaultProps = {
  type: null,
  tipoSolicitudId: null,
};

DatosPlanEstudios.propTypes = {
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.string,
  tipoSolicitudId: PropTypes.number,
};
