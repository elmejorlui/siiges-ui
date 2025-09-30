import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Grid } from '@mui/material';
import {
  DefaultModal, validateField, ButtonsForm,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import PropTypes from 'prop-types';
import errorDatosAsignaturas from '@siiges-ui/solicitudes/src/components/utils/sections/errors/errorDatosAsignaturas';
import handleEdit from '@siiges-ui/solicitudes/src/components/utils/submitEditAsignaturas';
import { area, grados } from '@siiges-ui/solicitudes/src/components/utils/Mocks/mockAsignaturas';

const tipos = [
  { id: 1, nombre: 'Normal' },
  { id: 2, nombre: 'Formación Electiva' },
];

export default function AsignaturasEditModal({
  open,
  hideModal,
  edit,
  rowItem,
  programaId,
  asignaturasList,
  setAsignaturasList,
  setNoti,
  setLoading,
  cicloId,
}) {
  const [formAsignaturas, setFormAsignaturas] = useState({});
  const [error, setError] = useState({});
  const originalValues = useRef({});
  const isDisabled = edit === 'Consultar Asignatura';

  const cicloIdMap = useMemo(() => ({
    1: grados.semestral,
    2: grados.cuatrimestral,
    3: grados.anual,
    4: grados.flexibleSemestral,
    5: grados.flexibleCuatrimestral,
    6: grados.optativa,
  }), []);

  const selectedGrade = useMemo(
    () => cicloIdMap[cicloId] || grados.semestral,
    [cicloId, cicloIdMap],
  );

  useEffect(() => {
    const initialValues = {
      id: rowItem.id ?? '',
      gradoId: rowItem.gradoId ?? '',
      tipo: rowItem.tipo ?? '',
      areaId: rowItem.areaId ?? '',
      nombre: rowItem.nombre ?? '',
      clave: rowItem.clave ?? '',
      creditos: rowItem.creditos ?? '',
      academia: rowItem.academia ?? '',
      seriacion: rowItem.seriacion ?? '',
      horasDocente: rowItem.horasDocente ?? '',
      horasIndependiente: rowItem.horasIndependiente ?? '',
    };

    setFormAsignaturas(initialValues);
    originalValues.current = initialValues;
  }, [rowItem, asignaturasList]);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormAsignaturas((prev) => {
      const newValue = name === 'tipo' ? Number(value) : value;
      return {
        ...prev,
        [name]: newValue,
        ...(name === 'tipo' && newValue === 2 ? { gradoId: 25 } : {}),
      };
    });
  };

  const handleOnBlur = ({ target: { name } }) => {
    validateField(formAsignaturas, name, setError, errorDatosAsignaturas);
  };

  const handleOnSubmit = () => {
    const diff = Object.entries(formAsignaturas).reduce((acc, [key, value]) => {
      if (value !== originalValues.current[key]) acc[key] = value;
      return acc;
    }, {});

    if (!Object.keys(diff).length) {
      hideModal();
      return;
    }

    if (diff.gradoId) {
      const grade = selectedGrade.find((g) => g.id === diff.gradoId);
      if (grade) diff.grado = grade.nombre;
    }

    handleEdit(
      formAsignaturas,
      setFormAsignaturas,
      () => {},
      setAsignaturasList,
      hideModal,
      setNoti,
      programaId,
      1,
      setLoading,
    );
  };

  const seriacionOptions = useMemo(
    () => asignaturasList.map(({ id, clave }) => ({ id, nombre: clave })),
    [asignaturasList],
  );

  return (
    <DefaultModal open={open} setOpen={hideModal} title={edit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <BasicSelect
            title="Tipo"
            name="tipo"
            value={formAsignaturas.tipo}
            options={tipos}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.tipo}
            required
            disabled={isDisabled}
          />
        </Grid>

        {formAsignaturas.tipo !== 2 && (
          <Grid item xs={6}>
            <BasicSelect
              title="Grado"
              name="gradoId"
              value={formAsignaturas.gradoId}
              options={selectedGrade}
              onChange={handleOnChange}
              onblur={handleOnBlur}
              errorMessage={error.gradoId}
              required
              disabled={isDisabled}
            />
          </Grid>
        )}

        <Grid item xs={6}>
          <BasicSelect
            title="Área"
            name="areaId"
            value={formAsignaturas.areaId}
            options={area}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.areaId}
            required
            disabled={isDisabled}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            value={formAsignaturas.nombre}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.nombre}
          />
        </Grid>

        <Grid item xs={3}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            value={formAsignaturas.clave}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.clave}
          />
        </Grid>

        <Grid item xs={3}>
          <Input
            id="creditos"
            label="Créditos"
            name="creditos"
            value={formAsignaturas.creditos}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.creditos}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            id="academia"
            label="Academia"
            name="academia"
            value={formAsignaturas.academia}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.academia}
          />
        </Grid>

        <Grid item xs={12}>
          <BasicSelect
            title="Seriación"
            name="seriacion"
            value={formAsignaturas.seriacion || ''}
            options={seriacionOptions}
            disabled={isDisabled}
            onChange={handleOnChange}
            textValue
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            value={formAsignaturas.horasDocente}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.horasDocente}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            id="horasIndependiente"
            label="Horas independiente"
            name="horasIndependiente"
            value={formAsignaturas.horasIndependiente}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={isDisabled}
            errorMessage={error.horasIndependiente}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" marginTop={2}>
        <ButtonsForm
          cancel={hideModal}
          confirm={handleOnSubmit}
          confirmDisabled={isDisabled}
          cancelText={isDisabled ? 'Regresar' : 'Cancelar'}
          confirmText="Guardar"
          justifyContent="flex-end"
        />
      </Grid>
    </DefaultModal>
  );
}

AsignaturasEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  edit: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  rowItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    gradoId: PropTypes.number,
    tipo: PropTypes.number,
    areaId: PropTypes.number,
    nombre: PropTypes.string,
    clave: PropTypes.string,
    creditos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    academia: PropTypes.string,
    seriacion: PropTypes.string,
    horasDocente: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horasIndependiente: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  programaId: PropTypes.number.isRequired,
  asignaturasList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string,
      clave: PropTypes.string,
    }),
  ).isRequired,
  setAsignaturasList: PropTypes.func.isRequired,
  setNoti: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  cicloId: PropTypes.number.isRequired,
};
