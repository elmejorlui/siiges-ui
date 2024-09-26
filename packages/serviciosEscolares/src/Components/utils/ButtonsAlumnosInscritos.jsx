import {
  Box, IconButton, Stack, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Context, DefaultModal, ButtonStyled, deleteRecord,
} from '@siiges-ui/shared';
import ModalAlumnosInscritos from './ModalAlumnosInscritos';

export default function ButtonsAlumnosInscritos({
  id,
  asignaturas,
  grupoId,
  fetchAlumnosInscritos,
  alumnoInfo,
}) {
  const { setNoti } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setTitle('Eliminar Alumno');
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteRecord({
        endpoint: `/alumnos/${id}/grupos/${grupoId}/inscripcion`,
      });

      if (result.statusCode === 200) {
        setNoti({
          open: true,
          message: '¡Alumno eliminado correctamente!',
          type: 'success',
        });
        setOpenDeleteModal(false);
        fetchAlumnosInscritos();
      } else {
        setNoti({
          open: true,
          message: result.errorMessage || 'Error al eliminar el alumno.',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: '¡Algo salió mal al eliminar al alumno!',
        type: 'error',
      });
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <IconButton
          aria-label="Consultar"
          onClick={() => {
            setTitle('Consultar Alumno');
            setOpen(true);
          }}
        >
          <ListAltIcon />
        </IconButton>
        <IconButton
          aria-label="Editar"
          onClick={() => {
            setTitle('Editar Alumno');
            setOpen(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="Eliminar"
          onClick={handleDeleteClick}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
      <ModalAlumnosInscritos
        alumnoId={id}
        grupoId={grupoId}
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
        asignaturas={asignaturas}
        title={title}
        alumnoAsignaturas={alumnoInfo ? alumnoInfo.alumnoAsignaturas : []}
      />
      <DefaultModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="Eliminar Inscripción"
      >
        {alumnoInfo ? (
          <>
            <Typography variant="h6">¿Está seguro de que desea eliminar esta inscripción?</Typography>
            <Box marginTop={2}>
              <Typography>
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ fontWeight: 'bold', display: 'inline' }}
                >
                  Nombre:
                </Typography>
                {' '}
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ fontWeight: 'normal', display: 'inline' }}
                >
                  {`${alumnoInfo.persona.nombre} ${alumnoInfo.persona.apellidoPaterno} ${alumnoInfo.persona.apellidoMaterno}`}
                </Typography>
              </Typography>
              <Typography>
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ fontWeight: 'bold', display: 'inline' }}
                >
                  Matrícula:
                </Typography>
                {' '}
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ fontWeight: 'normal', display: 'inline' }}
                >
                  {alumnoInfo.matricula}
                </Typography>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
              <Box sx={{ marginRight: 2 }}>
                <ButtonStyled
                  text="Cancelar"
                  alt="Cancelar"
                  design="error"
                  onclick={() => setOpenDeleteModal(false)}
                />
              </Box>
              <Box>
                <ButtonStyled
                  text="Confirmar"
                  alt="Confirmar"
                  onclick={handleDeleteConfirm}
                />
              </Box>
            </Box>
          </>
        ) : (
          <Typography>Cargando datos del alumno...</Typography>
        )}
      </DefaultModal>
    </>
  );
}

ButtonsAlumnosInscritos.propTypes = {
  id: PropTypes.number.isRequired,
  grupoId: PropTypes.number.isRequired,
  asignaturas: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchAlumnosInscritos: PropTypes.func.isRequired,
  alumnoInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    matricula: PropTypes.string.isRequired,
    persona: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellidoPaterno: PropTypes.string.isRequired,
      apellidoMaterno: PropTypes.string.isRequired,
    }).isRequired,
    alumnoAsignaturas: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        asignaturaId: PropTypes.number.isRequired,
        calificacion: PropTypes.string,
        tipo: PropTypes.number,
      }),
    ),
  }),
};

ButtonsAlumnosInscritos.defaultProps = {
  alumnoInfo: null,
};
