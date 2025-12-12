import Tooltip from '@mui/material/Tooltip';
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  ButtonsForm,
  DataTable,
  DefaultModal,
  Input,
  LabelData,
  Select,
} from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import fetchData from '../../../utils/FetchData';
import CalificacionInput from '../../../utils/CalificacionInput';

const columns = (handleDelete, handleEdit, disabled) => [
  {
    field: 'materiasAntecedente',
    headerName: 'Materias de Antecedente',
    width: 280,
  },
  {
    field: 'calificacionAntecedente',
    headerName: 'Calificación Antecedente',
    width: 200,
  },
  {
    field: 'materiasEquivalentes',
    headerName: 'Materias Equivalentes',
    width: 280,
  },
  {
    field: 'calificacionEquivalente',
    headerName: 'Calificación Equivalente',
    width: 200,
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 120,
    renderCell: (params) => (!disabled ? (
      <>
        <Tooltip title="Editar" placement="top">
          <IconButton
            onClick={() => handleEdit(params.row)}
            aria-label="editar"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" placement="top">
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            aria-label="eliminar"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ) : (
      <Tooltip title="Consultar" placement="top">
        <IconButton
          onClick={() => handleEdit(params.row)}
          aria-label="consultar"
        >
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    )),
  },
];

const domain = process.env.NEXT_PUBLIC_URL;

export default function CargaMateriasEquivalentes({
  form,
  handleOnChange,
  disabled,
  calificacionesReglas,
}) {
  const [open, setOpen] = useState(false);
  const [nombreAsignaturaAntecedente, setMateriaAntecedente] = useState('');
  const [calificacionAntecedente, setCalificacionAntecedente] = useState('');
  const [nombreAsignaturaEquivalente, setMateriaEquivalente] = useState('');
  const [asignaturaId, setAsignaturaId] = useState(null);
  const [programa, setPrograma] = useState({});
  const [calificacionEquivalente, setCalificacionEquivalente] = useState('');
  const [materiasList, setMateriasList] = useState([]);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const listaAsignaturas = form?.interesado?.asignaturasAntecedenteEquivalente ?? [];

  const handleDelete = (id) => {
    const updatedList = listaAsignaturas.filter((_, index) => index !== id);

    handleOnChange(
      {
        target: {
          name: 'asignaturasAntecedenteEquivalente',
          value: updatedList,
        },
      },
      ['interesado'],
    );
  };

  const handleEdit = (row) => {
    const index = listaAsignaturas.findIndex(
      (item) => item.asignaturaId === row.asignaturaId,
    );
    if (index === -1) return;

    setEditingId(index);
    setIsEditing(true);

    setMateriaAntecedente(row.materiasAntecedente);
    setCalificacionAntecedente(row.calificacionAntecedente);
    setMateriaEquivalente(row.materiasEquivalentes);
    setCalificacionEquivalente(row.calificacionEquivalente);
    setAsignaturaId(row.asignaturaId);
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setIsEditing(false);
    setAsignaturaId(null);
    setMateriaAntecedente('');
    setCalificacionAntecedente('');
    setMateriaEquivalente('');
    setCalificacionEquivalente('');
  };

  const handleConfirm = () => {
    const newEntry = {
      asignaturaId,
      nombreAsignaturaEquivalente,
      calificacionEquivalente,
      nombreAsignaturaAntecedente,
      calificacionAntecedente,
    };

    const updatedList = [...listaAsignaturas];

    if (isEditing && editingId !== null) {
      updatedList[editingId] = newEntry;
    } else {
      updatedList.push(newEntry);
    }

    handleOnChange(
      {
        target: {
          name: 'asignaturasAntecedenteEquivalente',
          value: updatedList,
        },
      },
      ['interesado'],
    );

    resetForm();
  };

  useEffect(() => {
    setRows(
      listaAsignaturas.map((item, index) => ({
        id: index,
        asignaturaId: item.asignaturaId,
        materiasAntecedente: item.nombreAsignaturaAntecedente,
        calificacionAntecedente: item.calificacionAntecedente,
        materiasEquivalentes: item.nombreAsignaturaEquivalente,
        calificacionEquivalente: item.calificacionEquivalente,
      })),
    );
  }, [listaAsignaturas]);

  useEffect(() => {
    if (
      form.interesado?.institucionDestino?.programaId !== null
      && form.interesado?.institucionDestino?.tipoInstitucionId === 1
    ) {
      fetchData(
        `${domain}/api/v1/public/asignaturas/programas/${form.interesado?.institucionDestino?.programaId}`,
        setMateriasList,
      );
      fetchData(
        `${domain}/api/v1/public/programas?acuerdoRvoe=${form.interesado?.institucionDestino?.acuerdoRvoe}`,
        setPrograma,
      );
    } else {
      setMateriasList([]);
      setAsignaturaId(null);
    }
  }, [
    form.interesado?.institucionDestino?.programaId,
    form.interesado?.institucionDestino?.tipoInstitucionId,
  ]);

  const materiasDisponibles = materiasList?.filter((materia) => {
    const usados = listaAsignaturas.map((item) => item.asignaturaId);

    if (isEditing && asignaturaId) {
      return !usados.includes(materia.id) || materia.id === asignaturaId;
    }

    return !usados.includes(materia.id);
  });

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <LabelData
            title="Calificacion minima"
            subtitle={calificacionesReglas.calificacionMinima}
          />
        </Grid>
        <Grid item xs={4}>
          <LabelData
            title="Calificacion maxima"
            subtitle={calificacionesReglas.calificacionMaxima}
          />
        </Grid>
        <Grid item xs={4}>
          <LabelData
            title="Calificacion aprobatoria"
            subtitle={calificacionesReglas.calificacionAprobatoria}
          />
        </Grid>
        <Grid item xs={12}>
          <DataTable
            buttonAdd={!disabled}
            buttonClick={() => {
              resetForm();
              setOpen(true);
            }}
            buttonText="Carga de Materia"
            title="Materias Equivalentes"
            rows={rows}
            columns={columns(handleDelete, handleEdit, disabled)}
          />
        </Grid>
      </Grid>
      <DefaultModal
        title={
          isEditing ? 'Editar Materia Equivalente' : 'Materias Equivalentes'
        }
        open={open}
        setOpen={setOpen}
      >
        <Grid container spacing={1}>
          {programa && (
            <>
              <Grid item xs={4}>
                <LabelData
                  title="Calificación Minima"
                  subtitle={programa.calificacionMinima}
                />
              </Grid>
              <Grid item xs={4}>
                <LabelData
                  title="Calificación Maxima"
                  subtitle={programa.calificacionMaxima}
                />
              </Grid>
              <Grid item xs={4}>
                <LabelData
                  title="Calificación Aprobatoria"
                  subtitle={programa.calificacionAprobatoria}
                />
              </Grid>
            </>
          )}
          <Grid item xs={6}>
            <Input
              id="nombreAsignaturaAntecedente"
              name="nombreAsignaturaAntecedente"
              label="Materias de Antecedente"
              value={nombreAsignaturaAntecedente}
              onChange={(e) => setMateriaAntecedente(e.target.value)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <CalificacionInput
              id="calificacionAntecedente"
              name="calificacionAntecedente"
              label="Calificación de Antecedente"
              value={calificacionAntecedente}
              onChange={(e) => setCalificacionAntecedente(e.target.value)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            {materiasList?.length > 0 ? (
              <Select
                title="Materias de Equivalente"
                options={materiasDisponibles}
                name="nombreAsignaturaEquivalente"
                value={asignaturaId || ''}
                onChange={(e) => setAsignaturaId(e.target.value)}
                disabled={disabled}
              />
            ) : (
              <Input
                id="nombreAsignaturaEquivalente"
                name="nombreAsignaturaEquivalente"
                label="Materias de Equivalente"
                value={nombreAsignaturaEquivalente}
                onChange={(e) => setMateriaEquivalente(e.target.value)}
                disabled={disabled}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <CalificacionInput
              id="calificacionEquivalente"
              name="calificacionEquivalente"
              label="Calificación de Equivalente"
              value={calificacionEquivalente}
              onChange={(e) => setCalificacionEquivalente(e.target.value)}
              disabled={disabled}
              calificacionMinima={
                programa?.calificacionMinima
                || calificacionesReglas.calificacionMinima
              }
              calificacionMaxima={
                programa?.calificacionMaxima
                || calificacionesReglas.calificacionMaxima
              }
              calificacionDecimal={
                programa?.calificacionDecimal
                || calificacionesReglas.calificacionDecimal
              }
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonsForm
              confirm={handleConfirm}
              cancel={resetForm}
              confirmDisabled={disabled}
              confirmText={isEditing ? 'Actualizar' : 'Confirmar'}
            />
          </Grid>
        </Grid>
      </DefaultModal>
    </>
  );
}

CargaMateriasEquivalentes.defaultProps = {
  handleOnChange: () => {},
  disabled: false,
  calificacionesReglas: {},
};

CargaMateriasEquivalentes.propTypes = {
  form: PropTypes.shape({
    interesado: PropTypes.shape({
      asignaturasAntecedenteEquivalente: PropTypes.arrayOf(
        PropTypes.shape({
          asignaturaId: PropTypes.number,
          nombreAsignaturaEquivalente: PropTypes.string,
          calificacionEquivalente: PropTypes.string,
          nombreAsignaturaAntecedente: PropTypes.string,
          calificacionAntecedente: PropTypes.string,
        }),
      ),
      institucionDestino: PropTypes.shape({
        programaId: PropTypes.number,
        acuerdoRvoe: PropTypes.string,
        tipoInstitucionId: PropTypes.number,
        institucionDestinoPrograma: PropTypes.shape({
          programa: PropTypes.shape({
            calificacionMinima: PropTypes.number,
            calificacionMaxima: PropTypes.number,
            calificacionAprobatoria: PropTypes.number,
          }),
        }),
      }),
    }),
  }).isRequired,
  calificacionesReglas: PropTypes.shape({
    id: PropTypes.number,
    calificacionDecimal: PropTypes.bool,
    calificacionMinima: PropTypes.number,
    calificacionMaxima: PropTypes.number,
    calificacionAprobatoria: PropTypes.number,
  }),
  handleOnChange: PropTypes.func,
  disabled: PropTypes.bool,
};
