import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
  DefaultModal, ButtonSimple, validateField, Context,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import PropTypes from 'prop-types';
import errorDatosAsignaturas from '../../sections/errors/errorDatosAsignaturas';
import handleEdit from '../../submitEditAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';
import { area, grados } from '../../Mocks/mockAsignaturas';
import SolicitudContext from '../../Context/solicitudContext';

export default function AsignaturasEditModal({
  open,
  hideModal,
  edit,
  rowItem,
}) {
  const {
    asignaturasList,
    setAsignaturasList,
    formAsignaturas,
    setFormAsignaturas,
    error,
    setError,
    setInitialValues,
    setNoti,
    programaId,
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
      const selectedGradeValue = cicloIdMap[form[1].programa.cicloId] || grados.semestral;
      setSelectedGrade(selectedGradeValue);
    }
  }, [form]);

  useEffect(() => {
    if (rowItem) {
      const cleanedSeriacion = rowItem.seriacion
        ? rowItem.seriacion
          .split(',')
          .map((item) => item.trim())
          .filter((item) => /^[A-Z0-9]+$/.test(item))
        : [];

      const rowItemValues = {
        id: rowItem.id,
        gradoId: rowItem.gradoId,
        areaId: rowItem.areaId,
        nombre: rowItem.nombre,
        clave: rowItem.clave,
        creditos: rowItem.creditos,
        academia: rowItem.academia,
        seriacion: cleanedSeriacion.join(','),
        horasDocente: rowItem.horasDocente,
        horasIndependiente: rowItem.horasIndependiente,
      };
      setFormAsignaturas(rowItemValues);
    }
  }, [rowItem]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormAsignaturas((prevData) => ({
      ...prevData,
      [name]:
        name === 'seriacion'
          ? value
            .filter(Boolean)
            .map((v) => v.trim())
            .filter((v) => /^[A-Z0-9]+$/.test(v))
            .join(',')
          : value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name } = e.target;
    validateField(formAsignaturas, name, setError, errorDatosAsignaturas);
  };

  const handleOnSubmit = () => {
    const {
      createdAt,
      deletedAt,
      updatedAt,
      ...submissionData
    } = formAsignaturas;

    const matchingGrade = selectedGrade.find((grade) => grade.id === submissionData.gradoId);
    const updatedFormAsignaturas = matchingGrade
      ? { ...submissionData, grado: matchingGrade.nombre }
      : submissionData;

    handleEdit(
      updatedFormAsignaturas,
      setFormAsignaturas,
      setInitialValues,
      setAsignaturasList,
      hideModal,
      setNoti,
      programaId,
      1,
      setLoading,
    );
  };

  const cancelButtonText = edit === 'Consultar Asignatura' ? 'Regresar' : 'Cancelar';

  return (
    <DefaultModal open={open} setOpen={hideModal} title={edit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <BasicSelect
            title="Grado"
            name="gradoId"
            value={formAsignaturas.gradoId ?? ''}
            options={selectedGrade}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.gradoId}
            required
            disabled={edit === 'Consultar Asignatura'}
          />
        </Grid>
        <Grid item xs={6}>
          <BasicSelect
            title="Área"
            name="areaId"
            value={formAsignaturas.areaId ?? ''}
            options={area}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.areaId}
            required
            disabled={edit === 'Consultar Asignatura'}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            value={formAsignaturas.nombre}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.nombre}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            auto="clave"
            value={formAsignaturas.clave}
            onChange={handleOnChange}
            onblur={handleOnBlur}
            required
            disabled={edit === 'Consultar Asignatura'}
            errorMessage={error.clave}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="creditos"
            label="Créditos"
            name="creditos"
            auto="creditos"
            value={formAsignaturas.creditos}
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
            multiple
            value={formAsignaturas.seriacion ? formAsignaturas.seriacion.split(',') : []}
            options={(asignaturasList || []).map((asig) => ({
              id: asig.clave,
              nombre: `${asig.nombre} | ${asig.clave}`,
            }))}
            onChange={handleOnChange}
            disabled={edit === 'Consultar Asignatura'}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            auto="horasDocente"
            value={formAsignaturas.horasDocente}
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
            value={formAsignaturas.horasIndependiente}
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
          <ButtonSimple text={cancelButtonText} design="enviar" onClick={hideModal} />
        </Grid>
        {edit !== 'Consultar Asignatura' && (
          <Grid item xs={2}>
            <ButtonSimple text="Guardar" onClick={handleOnSubmit} />
          </Grid>
        )}
      </Grid>
    </DefaultModal>
  );
}

AsignaturasEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  edit: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  rowItem: PropTypes.shape({
    id: PropTypes.number,
    gradoId: PropTypes.number,
    areaId: PropTypes.number,
    nombre: PropTypes.string,
    clave: PropTypes.string,
    creditos: PropTypes.number,
    academia: PropTypes.string,
    seriacion: PropTypes.string,
    horasDocente: PropTypes.number,
    horasIndependiente: PropTypes.number,
  }).isRequired,
};
