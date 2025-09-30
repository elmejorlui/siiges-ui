import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
  DefaultModal,
  ButtonSimple,
  validateField,
  Context,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import PropTypes from 'prop-types';
import errorDatosAsignaturas from '../../sections/errors/errorDatosAsignaturas';
import handleEdit from '../../submitEditAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';
import { grados } from '../../Mocks/mockAsignaturas';
import SolicitudContext from '../../Context/solicitudContext';

export default function AsignaturasFormacionEditModal({
  open,
  hideModal,
  edit,
  rowItem,
}) {
  const {
    error,
    setError,
    programaId,
    formAsignaturasFormacion,
    setFormAsignaturasFormacion,
    setInitialValues,
    asignaturasTotalList,
    setAsignaturasFormacionList,
    setNoti,
  } = useContext(TablesPlanEstudiosContext);
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

      const selectedGradeValue = cicloIdMap[form[1].programa.cicloId] || grados.semestral;
      setSelectedGrade(selectedGradeValue);
    }
  }, [form]);

  const { setLoading } = useContext(Context);

  useEffect(() => {
    const rowItemValues = {
      id: rowItem.id,
      gradoId: rowItem.gradoId,
      nombre: rowItem.nombre,
      clave: rowItem.clave,
      creditos: rowItem.creditos,
      academia: rowItem.academia,
      seriacion: rowItem.seriacion,
      horasDocente: rowItem.horasDocente,
      horasIndependiente: rowItem.horasIndependiente,
    };
    setFormAsignaturasFormacion(rowItemValues);
  }, [rowItem]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormAsignaturasFormacion((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value.join(',') : value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name } = e.target;
    validateField(
      formAsignaturasFormacion,
      name,
      setError,
      errorDatosAsignaturas,
    );
  };

  const handleOnSubmit = () => {
    const {
      createdAt, deletedAt, updatedAt, ...submissionData
    } = formAsignaturasFormacion;

    const matchingGrade = selectedGrade.find(
      (grade) => grade.id === submissionData.gradoId,
    );

    const updatedFormAsignaturas = matchingGrade
      ? { ...submissionData, grado: matchingGrade.nombre }
      : submissionData;

    handleEdit(
      updatedFormAsignaturas,
      setFormAsignaturasFormacion,
      setInitialValues,
      setAsignaturasFormacionList,
      hideModal,
      setNoti,
      programaId,
      2,
      setLoading,
    );
  };

  const cancelButtonText = edit === 'Consultar Asignatura' ? 'Regresar' : 'Cancelar';

  return (
    <DefaultModal open={open} setOpen={hideModal} title={edit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            value={rowItem.nombre}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.nombre}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            auto="clave"
            value={rowItem.clave}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.clave}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="creditos"
            label="Créditos"
            name="creditos"
            auto="creditos"
            value={rowItem.creditos}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
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
            disabled={edit === 'Consultar Asignatura'}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            auto="horasDocente"
            value={rowItem.horasDocente}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.horasDocente}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasIndependiente"
            label="Horas independiente"
            name="horasIndependiente"
            auto="horasIndependiente"
            value={rowItem.horasIndependiente}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.horasIndependiente}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" marginTop={2}>
        <Grid item xs={2}>
          <ButtonSimple
            text={cancelButtonText}
            design="cancel"
            onClick={hideModal}
          />
        </Grid>
        {edit !== 'Consultar Asignatura' && (
          <Grid item xs={2}>
            <ButtonSimple
              text="Guardar"
              onClick={handleOnSubmit}
            />
          </Grid>
        )}
      </Grid>
    </DefaultModal>
  );
}

AsignaturasFormacionEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  edit: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  rowItem: PropTypes.shape({
    id: PropTypes.number,
    gradoId: PropTypes.number,
    area: PropTypes.number,
    nombre: PropTypes.string,
    clave: PropTypes.string,
    creditos: PropTypes.string,
    academia: PropTypes.string,
    seriacion: PropTypes.string,
    horasDocente: PropTypes.number,
    horasIndependiente: PropTypes.number,
  }).isRequired,
};
