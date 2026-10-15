import { Grid } from '@mui/material';
import { Input, Select, Subtitle } from '@siiges-ui/shared';
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import fetchData from '../../../utils/FetchData';

const domain = process.env.NEXT_PUBLIC_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default function DatosInstitucion({
  form,
  handleOnChange,
  estados,
  disabled,
  setNextDisabled,
  setCalificacionesReglas,
}) {
  const [grados, setGrados] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [rvoes, setRvoes] = useState([]);
  const [rvoesList, setRvoesList] = useState([]);
  const [calificacionesReglasList, setCalificacionesReglasList] = useState([]);
  const [rvoeError, setRvoeError] = useState('');
  const [loadingRvoes, setLoadingRvoes] = useState(false);

  const tipoInstitucionId = form.interesado?.institucionDestino?.tipoInstitucionId || '';
  const carrera = form.interesado?.institucionDestino?.nombreCarrera || '';
  const institucionId = form.interesado?.institucionDestino?.institucionId
    || form.interesado?.institucionDestino?.institucionDestinoPrograma
      ?.programa?.plantel?.institucionId
    || '';
  const programaId = form.interesado?.institucionDestino?.programaId
    || form.interesado?.institucionDestino?.institucionDestinoPrograma
      ?.programaId
    || '';

  useEffect(() => {
    fetchData(
      `${domain}/api/v1/public/niveles/`,
      setGrados,
      (item) => ({
        id: item.id,
        nombre: item.descripcion,
      }),
      true,
    );
  }, []);

  useEffect(() => {
    if (!tipoInstitucionId) return;
    fetchData(
      `${domain}/api/v1/public/instituciones/opciones?tipoInstitucionId=${tipoInstitucionId}`,
      setInstituciones,
    );
  }, [tipoInstitucionId]);

  useEffect(() => {
    if (!institucionId) {
      setRvoes([]);
      return;
    }
    setLoadingRvoes(true);
    fetchData(
      `${domain}/api/v1/public/programas/instituciones/${institucionId}`,
      (data) => {
        setRvoes(data);
        setLoadingRvoes(false);
      },
    );
  }, [institucionId]);

  useEffect(() => {
    if (!rvoes?.length) {
      setRvoesList([]);
      return;
    }
    setRvoesList(
      rvoes.map(({ id, acuerdoRvoe, nombre }) => ({
        id,
        nombre: acuerdoRvoe,
        carrera: nombre,
      })),
    );
    setCalificacionesReglasList(
      rvoes.map(
        ({
          id,
          calificacionAprobatoria,
          calificacionDecimal,
          calificacionMaxima,
          calificacionMinima,
        }) => ({
          id,
          calificacionAprobatoria,
          calificacionDecimal,
          calificacionMaxima,
          calificacionMinima,
        }),
      ),
    );
  }, [rvoes]);

  const handleTipoInstitucionChange = (event) => {
    handleOnChange(event, ['interesado', 'institucionDestino']);
  };

  const handleInstitucionChange = (event) => {
    handleOnChange(event, ['interesado', 'institucionDestino']);

    if (tipoInstitucionId === 1) {
      handleOnChange({ target: { name: 'programaId', value: '' } }, ['interesado', 'institucionDestino']);
      handleOnChange({ target: { name: 'acuerdoRvoe', value: '' } }, ['interesado', 'institucionDestino']);
      handleOnChange({ target: { name: 'nombreCarrera', value: '' } }, ['interesado', 'institucionDestino']);
    }
  };

  const TIPOS_INSTITUCION = [
    { id: 1, nombre: 'Incorporación Estatal' },
    { id: 2, nombre: 'Organismo Público Descentralizado' },
    { id: 3, nombre: 'Incorporación Federal' },
  ];

  const handleRvoeChange = (event) => {
    const selectedId = Number(event.target.value);
    const selectedRvoe = rvoesList.find((r) => r.id === selectedId);
    const reglas = calificacionesReglasList.find((cr) => cr.id === selectedId);
    setCalificacionesReglas(reglas);

    if (selectedRvoe) {
      handleOnChange(
        { target: { name: 'acuerdoRvoe', value: selectedRvoe.nombre } },
        ['interesado', 'institucionDestino'],
      );
      handleOnChange(
        { target: { name: 'nombreCarrera', value: selectedRvoe.carrera } },
        ['interesado', 'institucionDestino'],
      );
      setRvoeError('');
    } else {
      setRvoeError('RVOE inválido');
    }

    handleOnChange(event, ['interesado', 'institucionDestino']);
  };

  const handleRvoeOnBlur = async (event) => {
    const acuerdoRvoe = event.target.value;
    if (tipoInstitucionId !== 1 || !acuerdoRvoe) return;

    try {
      const response = await fetch(
        `${domain}/api/v1/public/programas?acuerdoRvoe=${acuerdoRvoe}`,
        {
          headers: {
            api_key: apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();

      if (!response.ok || !data.data?.length) {
        setRvoeError('RVOE inválido');
        return;
      }

      handleOnChange(
        { target: { name: 'nombreCarrera', value: data.data[0].nombre } },
        ['interesado', 'institucionDestino'],
      );
      setRvoeError('');
    } catch {
      setRvoeError('RVOE inválido');
    }
  };

  const camposRequeridos = useMemo(() => {
    const base = [
      'interesado.institucionProcedencia.nombre',
      'interesado.institucionProcedencia.estadoId',
      'interesado.institucionProcedencia.nivelId',
      'interesado.institucionProcedencia.nombreCarrera',
      'interesado.institucionDestino.tipoInstitucionId',
    ];

    if (tipoInstitucionId === 1) {
      base.push('interesado.institucionDestino.programaId');
    } else if (tipoInstitucionId) {
      base.push(
        'interesado.institucionDestino.nombre',
        'interesado.institucionDestino.nivel',
        'interesado.institucionDestino.acuerdoRvoe',
        'interesado.institucionDestino.nombreCarrera',
      );
    }

    return base;
  }, [tipoInstitucionId]);

  useEffect(() => {
    const isEmpty = (val) => val === undefined || val === null || val === '';

    const allFilled = camposRequeridos.every((path) => {
      const value = path
        .split('.')
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''),
          form,
        );
      return !isEmpty(value);
    });

    setNextDisabled(!allFilled);
  }, [form, camposRequeridos, setNextDisabled]);

  return (
    <Grid container spacing={1}>
      {/* Institución de Procedencia */}
      <Grid item xs={12}>
        <Subtitle>Datos de la Institución de procedencia</Subtitle>
      </Grid>

      <Grid item xs={9}>
        <Input
          id="nombreInstitucion"
          label="Nombre de la Institución"
          name="nombre"
          value={form.interesado?.institucionProcedencia?.nombre || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'institucionProcedencia'])}
          disabled={disabled}
          required
        />
      </Grid>

      <Grid item xs={3}>
        <Select
          title="Estado"
          options={estados || []}
          name="estadoId"
          value={form.interesado?.institucionProcedencia?.estadoId || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'institucionProcedencia'])}
          disabled={disabled}
          required
        />
      </Grid>

      <Grid item xs={4}>
        <Select
          title="Nivel Académico Procedente"
          options={grados || []}
          name="nivelId"
          value={form.interesado?.institucionProcedencia?.nivelId || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'institucionProcedencia'])}
          disabled={disabled}
          required
        />
      </Grid>

      <Grid item xs={8}>
        <Input
          id="nombreCarrera"
          label="Nombre de la Carrera"
          name="nombreCarrera"
          value={form.interesado?.institucionProcedencia?.nombreCarrera || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'institucionProcedencia'])}
          disabled={disabled}
          required
        />
      </Grid>

      {/* Institución de destino */}
      <Grid item xs={12}>
        <Subtitle>Datos de la Institución de destino</Subtitle>
      </Grid>

      <Grid item xs={3}>
        <Select
          title="Tipo de Institución"
          name="tipoInstitucionId"
          options={TIPOS_INSTITUCION || []}
          value={tipoInstitucionId}
          onChange={handleTipoInstitucionChange}
          disabled={disabled}
          required
        />
      </Grid>

      <Grid item xs={9}>
        {tipoInstitucionId === 1 ? (
          <Select
            title="Instituciones"
            options={instituciones || []}
            name="institucionId"
            value={institucionId}
            onChange={handleInstitucionChange}
            disabled={disabled}
            required
          />
        ) : (
          <Input
            id="institucionNombre"
            label="Institución de Educación Superior"
            name="nombre"
            value={form.interesado?.institucionDestino?.nombre || ''}
            onChange={(e) => handleOnChange(e, ['interesado', 'institucionDestino'])}
            disabled={disabled}
            required
          />
        )}
      </Grid>

      {/* Campos destino según tipoInstitucionId */}
      {tipoInstitucionId !== 1 && tipoInstitucionId && (
        <>
          <Grid item xs={3}>
            <Select
              title="Nivel Académico Destino"
              options={grados || []}
              name="nivel"
              value={form.interesado?.institucionDestino?.nivel || ''}
              onChange={(e) => handleOnChange(e, ['interesado', 'institucionDestino'])}
              disabled={disabled}
              required
            />
          </Grid>

          <Grid item xs={3}>
            <Input
              id="rvoe"
              label="RVOE"
              name="acuerdoRvoe"
              value={form.interesado?.institucionDestino?.acuerdoRvoe || ''}
              onBlur={handleRvoeOnBlur}
              onChange={(e) => handleOnChange(e, ['interesado', 'institucionDestino'])}
              errorMessage={rvoeError}
              disabled={disabled}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              id="nombreCarreraDestino"
              label="Nombre de la Carrera (Destino)"
              name="nombreCarrera"
              value={carrera}
              onChange={(e) => handleOnChange(e, ['interesado', 'institucionDestino'])}
              disabled={disabled}
              required
            />
          </Grid>
        </>
      )}

      {tipoInstitucionId === 1 && (
        <>
          <Grid item xs={3}>
            <Select
              title="RVOE"
              options={rvoesList || []}
              name="programaId"
              value={programaId}
              onChange={handleRvoeChange}
              errorMessage={rvoeError}
              disabled={disabled || loadingRvoes}
              required
            />
          </Grid>

          <Grid item xs={9}>
            <Input
              id="nombreCarreraDestino"
              label="Nombre de la Carrera (Destino)"
              name="nombreCarrera"
              value={carrera}
              disabled
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

DatosInstitucion.defaultProps = {
  handleOnChange: () => { },
  disabled: false,
  setNextDisabled: () => {},
};

DatosInstitucion.propTypes = {
  form: PropTypes.shape({
    interesado: PropTypes.shape({
      institucionProcedencia: PropTypes.shape({
        nombre: PropTypes.string,
        estadoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nivelId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombreCarrera: PropTypes.string,
      }),
      institucionDestino: PropTypes.shape({
        institucionId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        institucionDestinoPrograma: PropTypes.shape({
          institucionDestinoId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          programaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          programa: PropTypes.shape({
            nombre: PropTypes.string,
            acuerdoRvoe: PropTypes.string,
            plantel: PropTypes.shape({
              institucionId: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
              ]),
            }),
          }),
        }),
        tipoInstitucionId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre: PropTypes.string,
        nivel: PropTypes.string,
        acuerdoRvoe: PropTypes.string,
        programaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombreCarrera: PropTypes.string,
      }),
    }),
  }).isRequired,

  handleOnChange: PropTypes.func,
  estados: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    }),
  ).isRequired,
  disabled: PropTypes.bool,
  setNextDisabled: PropTypes.func,
  setCalificacionesReglas: PropTypes.func.isRequired,
};
