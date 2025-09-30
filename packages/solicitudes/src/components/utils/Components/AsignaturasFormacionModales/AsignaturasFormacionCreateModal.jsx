import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { DefaultModal, ButtonSimple, Context } from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import handleCreate from '../../submitNewAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';
import { grados } from '../../Mocks/mockAsignaturas';
import errorDatosAsignaturasFormacion from '../../sections/errors/errorDatosAsignaturasFormacion';

export default function AsignaturasFormacionCreateModal({
  open,
  hideModal,
  title,
}) {
  const {
    setAsignaturasFormacionList,
    setAsignaturasTotalList,
    formAsignaturasFormacion,
    setFormAsignaturasFormacion,
    asignaturasTotalList,
    setError,
    error,
    setErrors,
    initialValues,
    setInitialValues,
    setNoti,
  } = useContext(TablesPlanEstudiosContext);
  const { setLoading } = useContext(Context);

  const errorsAsignatura = errorDatosAsignaturasFormacion(
    formAsignaturasFormacion,
    setError,
    error,
  );

  useEffect(() => {
    if (errorsAsignatura !== undefined) {
      setErrors(errorsAsignatura);
    }

    setFormAsignaturasFormacion((prevForm) => ({
      ...prevForm,
      gradoId: 25,
    }));
  }, [error, setFormAsignaturasFormacion, setErrors]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormAsignaturasFormacion((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value.join(',') : value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    const initialValue = initialValues[name];

    if (
      errorsAsignatura[name]
      && typeof errorsAsignatura[name] === 'function'
    ) {
      if (value !== initialValue || value === '') {
        errorsAsignatura[name]();
      }
    }
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleOnSubmit = () => {
    const matchingGrade = grados.optativa.find(
      (grade) => grade.id === formAsignaturasFormacion.gradoId,
    );
    const updatedFormAsignaturas = matchingGrade
      ? { ...formAsignaturasFormacion, grado: matchingGrade.nombre }
      : { ...formAsignaturasFormacion };

    handleCreate(
      updatedFormAsignaturas,
      setFormAsignaturasFormacion,
      setInitialValues,
      setAsignaturasFormacionList,
      hideModal,
      setNoti,
      2,
      setLoading,
      setAsignaturasTotalList,
    );
  };

  return (
    <DefaultModal open={open} setOpen={hideModal} title={title}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            value={formAsignaturasFormacion.nombre || ''}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.nombre}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            auto="clave"
            value={formAsignaturasFormacion.clave || ''}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.clave}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="creditos"
            label="Créditos"
            name="creditos"
            auto="creditos"
            value={formAsignaturasFormacion.creditos || ''}
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
              formAsignaturasFormacion.seriacion
                ? formAsignaturasFormacion.seriacion.split(',')
                : []
            }
            options={(asignaturasTotalList || []).map((asig) => ({
              id: asig.clave,
              nombre: `${asig.nombre} | ${asig.clave}`,
            }))}
            onChange={handleOnChange}
            multiple
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            auto="horasDocente"
            value={formAsignaturasFormacion.horasDocente || ''}
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
            value={formAsignaturasFormacion.horasIndependiente || ''}
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
          <ButtonSimple
            text="Cancelar"
            design="cancel"
            onClick={hideModal}
          />
        </Grid>
        <Grid item xs={2}>
          <ButtonSimple
            text="Guardar"
            onClick={handleOnSubmit}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

AsignaturasFormacionCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};
