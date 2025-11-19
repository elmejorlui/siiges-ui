import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import {
  IconButton,
  Stack,
  Grid,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Link from 'next/link';
import {
  DefaultModal,
  Context,
  ButtonSimple,
  deleteRecord,
} from '@siiges-ui/shared';

export default function ButtonsAlumnos({
  id,
  url,
  matricula,
  onDeleteSuccess,
}) {
  const { session, setNoti } = useContext(Context);
  const [openModal, setOpenModal] = useState(false);

  const validUser = session?.rol === 'admin' || session?.rol === 'ce_sicyt';

  const handleDelete = async () => {
    const response = await deleteRecord({ endpoint: `/alumnos/${id}` });
    if (response.statusCode === 200) {
      setNoti({
        open: true,
        message: '¡Alumno eliminado correctamente!',
        type: 'success',
      });
      if (onDeleteSuccess) onDeleteSuccess(id);
    } else {
      setNoti({
        open: true,
        message: 'Error al eliminar el alumno.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Link href={`/serviciosEscolares/alumnos/${id}/ConsultarAlumno`} passHref>
          <Tooltip title="Consultar" placement="top">
            <IconButton aria-label="Historial Académico del Alumno" component="a">
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Link>
        <Link href={url} passHref>
          <Tooltip title="Editar" placement="top">
            <IconButton aria-label="Editar Alumno" component="a">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
        {validUser && (
          <Tooltip title="Eliminar" placement="top">
            <IconButton onClick={() => setOpenModal(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {validUser && (
        <DefaultModal open={openModal} setOpen={setOpenModal} id={id} title="Eliminar Alumno">
          <Typography>
            ¿Desea eliminar el alumno con matrícula
            {' '}
            <strong>{matricula}</strong>
            ?
          </Typography>
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <ButtonSimple text="Cancelar" design="cancel" onClick={() => setOpenModal(false)} />
            </Grid>
            <Grid item>
              <ButtonSimple
                text="Confirmar"
                design="delete"
                onClick={() => {
                  setOpenModal(false);
                  handleDelete();
                }}
              />
            </Grid>
          </Grid>
        </DefaultModal>
      )}
    </>
  );
}

ButtonsAlumnos.propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  matricula: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func,
};

ButtonsAlumnos.defaultProps = {
  onDeleteSuccess: null,
};
