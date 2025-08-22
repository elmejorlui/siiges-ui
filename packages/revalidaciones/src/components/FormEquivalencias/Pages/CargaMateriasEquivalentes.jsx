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

  const handleDelete = (id) => {
    if (form?.interesado?.asignaturasAntecedentesEquivalentes) {
      const updatedList = form.interesado.asignaturasAntecedentesEquivalentes.filter(
        (_, index) => index !== id,
      );

      handleOnChange(
        {
          target: {
            name: 'asignaturasAntecedentesEquivalentes',
            value: updatedList,
          },
        },
        ['interesado'],
      );
    }
  };

  const handleEdit = (row) => {
    const index = form.interesado.asignaturasAntecedentesEquivalentes.findIndex(
      (item) => item.asignaturaId === row.asignaturaId,
    );
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

    const updatedList = [
      ...form.interesado.asignaturasAntecedentesEquivalentes,
    ];

    if (isEditing && editingId !== null) {
      updatedList[editingId] = newEntry;
    } else {
      updatedList.push(newEntry);
    }

    handleOnChange(
      {
        target: {
          name: 'asignaturasAntecedentesEquivalentes',
          value: updatedList,
        },
      },
      ['interesado'],
    );

    resetForm();
  };

  useEffect(() => {
    if (form?.interesado?.asignaturasAntecedentesEquivalentes) {
      setRows(
        form.interesado.asignaturasAntecedentesEquivalentes.map(
          (item, index) => ({
            id: index,
            asignaturaId: item.asignaturaId,
            materiasAntecedente: item.nombreAsignaturaAntecedente,
            calificacionAntecedente: item.calificacionAntecedente,
            materiasEquivalentes: item.nombreAsignaturaEquivalente,
            calificacionEquivalente: item.calificacionEquivalente,
          }),
        ),
      );
    } else if (form?.interesado?.asignaturasAntecedenteEquivalente) {
      setRows(
        form.interesado.asignaturasAntecedenteEquivalente.map(
          (item, index) => ({
            id: index,
            asignaturaId: item.asignaturaId,
            materiasAntecedente: item.nombreAsignaturaAntecedente,
            calificacionAntecedente: item.calificacionAntecedente,
            materiasEquivalentes: item.nombreAsignaturaEquivalente,
            calificacionEquivalente: item.calificacionEquivalente,
          }),
        ),
      );
    }
  }, [form]);

  useEffect(() => {
    if (asignaturaId && materiasList?.length > 0) {
      const selectedMateria = materiasList.find(
        (materia) => materia.id === parseInt(asignaturaId, 10),
      );
      if (selectedMateria) {
        setMateriaEquivalente(selectedMateria.nombre);
      } else {
        setMateriaEquivalente('');
      }
    } else {
      setMateriaEquivalente('');
    }
  }, [asignaturaId, materiasList]);

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

  return (
    <>
      <Grid container spacing={1}>
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
                  title="Calificacion Minima"
                  subtitle={programa.calificacionMinima}
                />
              </Grid>
              <Grid item xs={4}>
                <LabelData
                  title="Calificacion Maxima"
                  subtitle={programa.calificacionMaxima}
                />
              </Grid>
              <Grid item xs={4}>
                <LabelData
                  title="Calificacion Aprovatoria"
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
                options={materiasList}
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
              calificacionMinima={programa?.calificacionMinima}
              calificacionMaxima={programa?.calificacionMaxima}
              calificacionDecimal={programa?.calificacionDecimal}
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
};

CargaMateriasEquivalentes.propTypes = {
  form: PropTypes.shape({
    interesado: PropTypes.shape({
      asignaturasAntecedentesEquivalentes: PropTypes.arrayOf(
        PropTypes.shape({
          asignaturaId: PropTypes.number,
          nombreAsignaturaEquivalente: PropTypes.string,
          calificacionEquivalente: PropTypes.string,
          nombreAsignaturaAntecedente: PropTypes.string,
          calificacionAntecedente: PropTypes.string,
        }),
      ),
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
      }),
    }),
  }).isRequired,
  handleOnChange: PropTypes.func,
  disabled: PropTypes.bool,
};
