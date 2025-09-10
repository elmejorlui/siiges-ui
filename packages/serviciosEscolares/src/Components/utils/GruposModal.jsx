import React, { useContext, useState } from 'react';
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
  const [form, setForm] = useState();

  const safeSetFetchGrupos = (value) => {
    if (typeof setFetchGrupos === 'function') {
      setFetchGrupos(value);
    }
  };

  const pathGrupo = async (dataForm) => {
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
          <LabelData
            title="Ciclo Escolar"
            subtitle={params?.cicloNombre}
          />
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
            value={params?.cicloNombre === 'EQUIV' ? 'UNICO' : data?.descripcion}
            disabled={params?.cicloNombre === 'EQUIV'}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Turno"
            value={params?.cicloNombre === 'EQUIV' ? 1 : data?.turnoId}
            options={turnos}
            onChange={handleOnChange}
            id="turnoId"
            name="turnoId"
            disabled={params?.cicloNombre === 'EQUIV'}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            id="generacion"
            label="Generación"
            name="generacion"
            auto="generacion"
            onChange={handleOnChange}
            value={data?.generacion}
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
            value={data?.generacionFechaInicio}
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
            value={data?.generacionFechaFin}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <ButtonsForm
            confirm={() => {
              pathGrupo(form);
            }}
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
