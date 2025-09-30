import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import {
  DefaultModal,
  ButtonSimple,
  validateField,
  Context,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import errorDatosAsignaturas from '../../sections/errors/errorDatosAsignaturas';
import handleCreate from '../../submitNewAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';
import { area, grados } from '../../Mocks/mockAsignaturas';
import SolicitudContext from '../../Context/solicitudContext';

export default function AsignaturasCreateModal({ open, hideModal, title }) {
  const {
    asignaturasList,
    setAsignaturasList,
    formAsignaturas,
    setFormAsignaturas,
    error,
    setError,
    setInitialValues,
    setNoti,
  } = useContext(TablesPlanEstudiosContext);
  const { setLoading } = useContext(Context);
  const { form } = useContext(SolicitudContext);
  const [selectedGrade, setSelectedGrade] = useState(grados.semestral);

  useEffect(() => {
    if (form) {
      const cicloIdMap = {
        1: grados.semestral,
        2: grados.cuatrimestral,
        3: grados.anual,
        4: grados.flexibleSemestral,
        5: grados.flexibleCuatrimestral,
        6: grados.optativa,
      };

      const selectedGradeValue = cicloIdMap[form[1].programa?.cicloId];
      setSelectedGrade(selectedGradeValue);
    }
  }, [form]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormAsignaturas((prevData) => ({
      ...prevData,
      [name]: name === 'seriacion' ? value.join(',') : value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name } = e.target;
    validateField(formAsignaturas, name, setError, errorDatosAsignaturas);
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleOnSubmit = async () => {
    const matchingGrade = selectedGrade.find(
      (grade) => grade.id === formAsignaturas.gradoId,
    );
    const updatedFormAsignaturas = matchingGrade
      ? { ...formAsignaturas, grado: matchingGrade.nombre }
      : { ...formAsignaturas };

    try {
      await handleCreate(
        updatedFormAsignaturas,
        setFormAsignaturas,
        setInitialValues,
        setAsignaturasList,
        hideModal,
        setNoti,
        1,
        setLoading,
      );
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <DefaultModal open={open} setOpen={hideModal} title={title}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <BasicSelect
            title="Grado"
            name="gradoId"
            value=""
            options={selectedGrade}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.gradoId}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <BasicSelect
            title="Área"
            name="areaId"
            value=""
            options={area}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.areaId}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.nombre}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            auto="clave"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.clave}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="creditos"
            label="Créditos"
            name="creditos"
            auto="creditos"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.creditos}
          />
        </Grid>
        <Grid item xs={12}>
          <BasicSelect
            title="Seriación"
            name="seriacion"
            value={
              formAsignaturas.seriacion
                ? formAsignaturas.seriacion.split(',')
                : []
            }
            multiple
            options={(asignaturasList || []).map((asig) => ({
              id: asig.clave,
              nombre: `${asig.nombre} | ${asig.clave}`,
            }))}
            onChange={handleOnChange}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            auto="horasDocente"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.horasDocente}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasIndependiente"
            label="Horas independiente"
            name="horasIndependiente"
            auto="horasIndependiente"
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.horasIndependiente}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" marginTop={2}>
        <Grid item xs={2}>
          <ButtonSimple text="Cancelar" design="cancel" onClick={hideModal} />
        </Grid>
        <Grid item xs={2}>
          <ButtonSimple text="Guardar" onClick={handleOnSubmit} />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

AsignaturasCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};
