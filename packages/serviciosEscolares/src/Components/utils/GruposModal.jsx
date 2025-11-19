import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {
  ButtonsForm,
  Context,
  DefaultModal,
  Input,
  InputDate,
  LabelData,
  Select,
} from '@siiges-ui/shared';
import grupoService from './gruposService';

const turnos = [
  { id: 1, nombre: 'Matutino' },
  { id: 2, nombre: 'Vespertino' },
  { id: 3, nombre: 'Nocturno' },
  { id: 4, nombre: 'Mixto' },
];

export default function GruposModal({
  open,
  setOpen,
  type,
  data,
  params,
  onSuccess,
  setFetchGrupos,
}) {
  const title = type === 'new' ? 'Agregar Grupo' : 'Modificar Grupo';
  const { setNoti, setLoading } = useContext(Context);

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({
        descripcion: params?.cicloNombre === 'EQUIV' ? 'UNICO' : data?.descripcion || '',
        turnoId: params?.cicloNombre === 'EQUIV' ? 1 : data?.turnoId || '',
        generacion: data?.generacion || '',
        generacionFechaInicio: data?.generacionFechaInicio || '',
        generacionFechaFin: data?.generacionFechaFin || '',
      });
      setErrors({});
    }
  }, [open, data, params]);

  const safeSetFetchGrupos = (value) => {
    if (typeof setFetchGrupos === 'function') {
      setFetchGrupos(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.descripcion?.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!form.turnoId) newErrors.turnoId = 'El turno es obligatorio';
    if (!form.generacion?.trim()) newErrors.generacion = 'La generación es obligatoria';
    if (!form.generacionFechaInicio) newErrors.generacionFechaInicio = 'La fecha de inicio es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pathGrupo = async (dataForm) => {
    if (!validateForm()) return;

    setLoading(true);
    const equiv = params?.cicloNombre === 'EQUIV';

    const dataBody = {
      ...dataForm,
      ...params,
      ...(equiv ? { turnoId: 1, descripcion: 'UNICO' } : {}),
    };

    try {
      let result;
      if (data?.id) {
        result = await grupoService({ id: data.id, dataBody }, onSuccess);
      } else {
        result = await grupoService({ dataBody }, onSuccess);
      }

      if (result) {
        safeSetFetchGrupos(true);
        setOpen(false);
      }
    } catch (error) {
      setNoti({
        open: true,
        message: '¡Error al guardar Grupo!',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <DefaultModal open={open} setOpen={setOpen} title={title}>
      <Grid container spacing={1}>
        {data?.id && (
          <Grid item xs={2}>
            <LabelData title="ID" subtitle={data?.id} />
          </Grid>
        )}
        <Grid item xs={4}>
          <LabelData title="Ciclo Escolar" subtitle={params?.cicloNombre} />
        </Grid>
        <Grid item xs={4}>
          <LabelData title="Grado" subtitle={params?.gradoNombre} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={4}>
          <Input
            id="descripcion"
            label="Descripción"
            name="descripcion"
            auto="descripcion"
            onChange={handleOnChange}
            value={form.descripcion}
            disabled={params?.cicloNombre === 'EQUIV'}
            required
            errorMessage={errors.descripcion}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Turno"
            value={form.turnoId}
            options={turnos}
            onChange={handleOnChange}
            id="turnoId"
            name="turnoId"
            disabled={params?.cicloNombre === 'EQUIV'}
            required
            errorMessage={errors.turnoId}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="generacion"
            label="Generación"
            name="generacion"
            auto="generacion"
            onChange={handleOnChange}
            value={form.generacion}
            required
            errorMessage={errors.generacion}
          />
        </Grid>
        <Grid item xs={6}>
          <InputDate
            id="generacionFechaInicio"
            label="Fecha de inicio de generación"
            name="generacionFechaInicio"
            auto="generacionFechaInicio"
            onChange={handleOnChange}
            type="date"
            value={form.generacionFechaInicio}
            required
            errorMessage={errors.generacionFechaInicio}
          />
        </Grid>
        <Grid item xs={6}>
          <InputDate
            id="generacionFechaFin"
            label="Fecha de fin de generación"
            name="generacionFechaFin"
            auto="generacionFechaFin"
            onChange={handleOnChange}
            type="date"
            value={form.generacionFechaFin}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <ButtonsForm
            confirm={() => pathGrupo(form)}
            cancel={() => setOpen(false)}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

GruposModal.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  setFetchGrupos: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  params: PropTypes.shape({
    cicloEscolarId: PropTypes.number,
    cicloNombre: PropTypes.string,
    gradoId: PropTypes.number,
    gradoNombre: PropTypes.string,
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    cicloEscolarId: PropTypes.number,
    turnoId: PropTypes.number,
    gradoId: PropTypes.number,
    descripcion: PropTypes.string,
    gradoNombre: PropTypes.string,
    generacion: PropTypes.string,
    generacionFechaInicio: PropTypes.string,
    generacionFechaFin: PropTypes.string,
  }).isRequired,
};
