import React, {
  useContext, useEffect, useState, useMemo,
} from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import {
  ButtonSimple, DefaultModal, Input, InputNumber,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import PropTypes from 'prop-types';
import errorDatosPlanEstudios from '../utils/sections/errors/errorDatosPlanEstudios';
import SolicitudContext from '../utils/Context/solicitudContext';
import formDatosPlanEstudios from '../utils/sections/forms/formDatosPlanEstudios';
import useSectionDisabled from './Hooks/useSectionDisabled';

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
];

const periodoOptionsBase = [
  { id: 1, nombre: 'Semestral' },
  { id: 2, nombre: 'Cuatrimestral' },
  { id: 3, nombre: 'Anual' },
  { id: 4, nombre: 'Semestral curriculum flexible' },
  { id: 5, nombre: 'Cuatrimestral curriculum flexible' },
  { id: 5, nombre: 'Anual curriculum flexible' },
];

const tipoCurriculaOptions = [
  { id: 1, nombre: 'Rígida' },
  { id: 2, nombre: 'Flexible' },
];

const turno = [
  { id: 1, nombre: 'Matutino' },
  { id: 2, nombre: 'Vespertino' },
  { id: 3, nombre: 'Nocturno' },
  { id: 4, nombre: 'Mixto' },
];

export default function DatosPlanEstudios({ disabled, type, tipoSolicitudId }) {
  const [initialValues, setInitialValues] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (type !== 'editar' && type !== 'consultar') {
      setOpen(true);
    }
  }, [type]);

  const {
    form, setForm, error, setError, setErrors,
  } = useContext(SolicitudContext);
  const isSectionDisabled = useSectionDisabled(1);

  const isDisabled = disabled || isSectionDisabled;

  useEffect(() => {
    const duracion = form[1].programa?.duracionPeriodos;
    if (duracion === undefined || duracion === null || duracion === '' || Number(duracion) < 1) {
      setForm((prevForm) => ({
        ...prevForm,
        1: { ...prevForm[1], programa: { ...prevForm[1]?.programa, duracionPeriodos: 1 } },
      }));
    }
  }, [form[1].programa?.duracionPeriodos, setForm]);

  const handleOnChange = (e) => {
    const { name, value } = e?.target || {};
    if (name && value !== undefined) {
      if (name === 'duracionPeriodos') {
        const numVal = parseInt(value, 10);
        const validValue = Number.isNaN(numVal) || numVal < 1 ? 1 : numVal;
        formDatosPlanEstudios(name, validValue, form, setForm);
        return;
      }
      formDatosPlanEstudios(name, value, form, setForm);
    }
  };

  const errors = useMemo(
    () => errorDatosPlanEstudios(form, setError, error, tipoSolicitudId),
    [form, setError, error, tipoSolicitudId],
  );
  const creditosOrdinarios = form[1].programa?.creditosOrdinarios;
  const minimoCreditosOptativas = form[1].programa?.minimoCreditosOptativas;

  useEffect(() => {
    const esValido = (valor) => valor !== undefined && valor !== null && valor !== '';
    if (!esValido(creditosOrdinarios) || !esValido(minimoCreditosOptativas)) return;

    const ordinarios = Number(creditosOrdinarios);
    const optativas = Number(minimoCreditosOptativas);
    const total = (
      Number.isNaN(ordinarios) ? 0 : ordinarios) + (Number.isNaN(optativas) ? 0 : optativas);

    if (form[1].programa?.creditos !== total) {
      setForm((prevForm) => ({
        ...prevForm,
        1: { ...prevForm[1], programa: { ...prevForm[1]?.programa, creditos: total } },
      }));
    }
  }, [creditosOrdinarios, minimoCreditosOptativas, form, setForm]);

  const handleOnBlur = (e) => {
    const { name, value } = e?.target || {};
    if (name && value !== undefined) {
      if (name === 'duracionPeriodos') return;
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
  }, [errors, setErrors]);

  const [tipoCurricula, setTipoCurricula] = useState('');

  const periodoOptions = useMemo(() => {
    if (tipoCurricula === 1) return periodoOptionsBase.filter((p) => [1, 2, 3].includes(p.id));
    if (tipoCurricula === 2) return periodoOptionsBase.filter((p) => [4, 5, 6].includes(p.id));
    return periodoOptionsBase;
  }, [tipoCurricula]);

  useEffect(() => {
    const cicloId = Number(form[1].programa?.cicloId);
    if (tipoCurricula === '' && cicloId) {
      if ([1, 2].includes(cicloId)) setTipoCurricula(1);
      else if ([4, 5].includes(cicloId)) setTipoCurricula(2);
    }
  }, [form[1].programa?.cicloId]);

  const handleTipoCurriculaChange = (e) => {
    const parsedValue = Number(e.target.value);

    setTipoCurricula(parsedValue);
    formDatosPlanEstudios('cicloId', '', form, setForm);
  };

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
            title="Tipo de currícula"
            name="tipoCurricula"
            value={tipoCurricula}
            options={tipoCurriculaOptions}
            onChange={handleTipoCurriculaChange}
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <BasicSelect
            key={`select-periodo-${tipoCurricula}`}
            title="Periodo"
            name="cicloId"
            value={form[1].programa?.cicloId || ''}
            options={periodoOptions}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.cicloId}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={3}>
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
          <InputNumber
            id="duracionPeriodos"
            label="Duración del programa"
            name="duracionPeriodos"
            auto="duracionPeriodos"
            onChange={handleOnChange}
            value={form[1].programa?.duracionPeriodos || 1}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={undefined}
            required
            disabled={isDisabled}
            min={1}
          />
        </Grid>
        <Grid item xs={3} sx={{ mt: 3 }}>
          <Typography>Periodos</Typography>
        </Grid>
        <Grid item xs={6}>
          <Input
            id="creditos"
            label="Créditos necesarios para concluir el programa (Ordinarios + Optativas)"
            name="creditos"
            auto="creditos"
            value={form[1].programa?.creditos}
            errorMessage={error.creditos}
            required
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="creditosOrdinarios"
            label="Créditos ordinarios"
            name="creditosOrdinarios"
            auto="creditosOrdinarios"
            value={form[1].programa?.creditosOrdinarios}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.creditosOrdinarios}
            required
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="minimoCreditosOptativas"
            label="Créditos electivas"
            name="minimoCreditosOptativas"
            auto="minimoCreditosOptativas"
            value={form[1].programa?.minimoCreditosOptativas}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.minimoCreditosOptativas}
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
