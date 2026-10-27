import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  GetFile,
  Input,
  InputDateTime,
  InputFile,
  InputNumber,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import { useRouter } from 'next/router';
import errorDatosGeneralesEvaluacion from '../utils/sections/errors/errorDatosGeneralesEvaluacion';
import { useEvaluacionCurricular } from '../utils/Context/evaluacionCurricularContext';
import getEvaluadores from '../utils/getEvaluadores';
import getSolicitudesById from '../utils/getSolicitudesById';
import useSectionDisabled from './Hooks/useSectionDisabled';

export default function DatosGeneralesEvaluacion({ disabled, id, type }) {
  const {
    form, setForm, error, setError, setErrors,
  } = useEvaluacionCurricular();
  const [initialValues, setInitialValues] = useState({});
  const { solicitudes } = getSolicitudesById(id);
  const router = useRouter();
  const { query } = router;
  const [url, setUrl] = useState('');
  const [guiaUrl, setGuiaUrl] = useState('');

  const isSectionDisabled = useSectionDisabled(21);

  const isDisabled = disabled || isSectionDisabled;

  useEffect(() => {
    const modalidadSource = (type === 'editar' || type === 'consultar')
      ? solicitudes?.programa?.modalidadId
      : query.modalidad;

    if ((type === 'editar' || type === 'consultar') && solicitudes?.programa?.evaluacion?.id) {
      setForm((prevForm) => ({
        ...prevForm,
        modalidad: modalidadSource,
        id: solicitudes.programa.evaluacion.id,
        evaluadorId: solicitudes.programa.evaluacion.evaluadorId,
        valoracion: solicitudes.programa.evaluacion.valoracion,
        fecha: solicitudes.programa.evaluacion.fecha,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        modalidad: modalidadSource,
      }));
    }

    if ((type === 'editar' || type === 'consultar') && form.programaId) {
      const fileData = {
        entidadId: form.programaId,
        tipoEntidad: 'PROGRAMA',
        tipoDocumento: 'DICTAMEN_EVALUACION',
      };
      GetFile(fileData, setUrl);

      const guiaData = {
        entidadId: form.programaId,
        tipoEntidad: 'PROGRAMA',
        tipoDocumento: 'GUIA_EVALUACION',
      };
      GetFile(guiaData, setGuiaUrl);
    }
  }, [type, solicitudes, form.programaId, query]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validation = errorDatosGeneralesEvaluacion(form, setError, error);

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    const initialValue = initialValues[name];
    if (value !== initialValue || value === '') {
      validation[name]();
    }
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  useEffect(() => {
    if (validation !== undefined) {
      setErrors(validation);
    }
  }, [error]);

  const { evaluadores } = getEvaluadores();

  const evaluadoresData = evaluadores.map((evaluador) => ({
    id: evaluador.id,
    nombre: `${evaluador.persona.nombre} ${evaluador.persona.apellidoPaterno}`,
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos generales de evaluación</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={3}>
          <InputDateTime
            id="fecha"
            label="Fecha de dictamen"
            name="fecha"
            type="datetime"
            value={form.fecha}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            disabled={isDisabled}
            errorMessage={error.fecha}
            required
          />
        </Grid>
        <Grid item xs={9}>
          <BasicSelect
            title="Evaluador"
            name="evaluadorId"
            value={form.evaluadorId || ''}
            options={evaluadoresData}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            errorMessage={error.evaluadorId}
            disabled={isDisabled}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="valoracion"
            label="Valoración cualitativa"
            name="valoracion"
            value={form.valoracion}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            multiline
            rows={4}
            sx={{ width: '100%' }}
            disabled={isDisabled}
            helperText={error.valoracion}
            error={!!error.valoracion}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            id={form.programaId}
            label="Dictamen de evaluación"
            tipoEntidad="PROGRAMA"
            tipoDocumento="DICTAMEN_EVALUACION"
            url={url}
            setUrl={setUrl}
            disabled={isDisabled}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            id={form.programaId}
            label="Guía de evaluación"
            tipoEntidad="PROGRAMA"
            tipoDocumento="GUIA_EVALUACION"
            url={guiaUrl}
            setUrl={setGuiaUrl}
            disabled={isDisabled}
            required
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

DatosGeneralesEvaluacion.defaultProps = {
  id: null,
};

DatosGeneralesEvaluacion.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.number,
  type: PropTypes.string.isRequired,
};
