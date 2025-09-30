import {
  Grid, Typography, IconButton, Tooltip,
} from '@mui/material';
import {
  ButtonsForm, Context, DefaultModal, getToken,
} from '@siiges-ui/shared';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

function DeleteCicloEscolar({ id, onSuccess }) {
  const { setNoti, session } = useContext(Context);

  const [open, setOpen] = useState(false);
  const allowedRoles = ['admin', 'serv_soc_ies', 'representante'];
  const canDelete = session && allowedRoles.includes(session.rol);

  if (!canDelete) return null;

  const handleDelete = async () => {
    const apikey = process.env.NEXT_PUBLIC_API_KEY;
    const url = process.env.NEXT_PUBLIC_URL;
    const token = getToken();

    try {
      const response = await fetch(`${url}/api/v1/ciclosEscolares/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      });

      if ([200, 201, 204].includes(response.status)) {
        if (onSuccess) onSuccess();
        setOpen(false);
        setNoti({
          open: true,
          message: '¡Ciclo escolar eliminado exitosamente!',
          type: 'success',
        });
      } else if (response.status === 409) {
        const { message } = await response.json();
        if (message === 'El ciclo escolar no puede ser eliminado ya que tiene grupos vinculados') {
          setNoti({ open: true, message, type: 'warning' });
        } else {
          setNoti({ open: true, message, type: 'error' });
        }
      } else {
        const { message } = await response.json();
        setNoti({
          open: true,
          message: '¡No se ha podido eliminar el ciclo escolar!',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error de eliminación:', error);
      setNoti({ open: true, message: error.toString(), type: 'error' });
    }
  };

  return (
    <>
      <Tooltip title="Eliminar" placement="top">
        <IconButton
          aria-label="Eliminar Ciclo escolar"
          onClick={() => setOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <DefaultModal open={open} setOpen={() => setOpen(false)} title="Eliminar Ciclo Escolar">
        <Typography>¿Desea eliminar este ciclo escolar?</Typography>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <ButtonsForm
            cancel={() => setOpen(false)}
            confirm={handleDelete}
            cancelText="Cancelar"
            confirmText="Confirmar"
          />
        </Grid>
      </DefaultModal>
    </>
  );
}

DeleteCicloEscolar.propTypes = {
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default DeleteCicloEscolar;
