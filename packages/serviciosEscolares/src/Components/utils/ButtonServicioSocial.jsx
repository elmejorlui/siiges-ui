import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  IconButton, Stack, Menu, MenuItem,
} from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import EditIcon from '@mui/icons-material/EditOutlined';
import { useUI } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import Link from 'next/link';
import alumnosService from './alumnosService';
import {
  opcionesEstatusServicioSocial,
} from '../ServicioSocialAlumnos/servicioSocialUtils';

export default function ButtonServicioSocial({
  id, url, programa, institucion, nivel, estatusServicioSocialId, onUpdated,
}) {
  const { setNoti } = useUI();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const opciones = opcionesEstatusServicioSocial(nivel);

  const linkUrl = `${url}/${id}?programa=${programa}&institucion=${institucion}&nivel=${nivel || ''}`;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectEstatus = async (estatusId) => {
    handleCloseMenu();

    if (estatusId === estatusServicioSocialId) return;

    try {
      await alumnosService({
        id,
        method: 'PATCH',
        dataBody: { estatusServicioSocial: estatusId },
      });

      const opcionSeleccionada = opciones.find((option) => option.id === estatusId);
      setNoti({
        open: true,
        message: `Estatus de servicio social actualizado: ${opcionSeleccionada?.nombre}`,
        type: 'success',
      });

      if (onUpdated) onUpdated(id, estatusId, opcionSeleccionada?.nombre);
    } catch (error) {
      setNoti({
        open: true,
        message: error.message || '¡Error al actualizar el estatus de servicio social!',
        type: 'error',
      });
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      {id && (
        <Link href={linkUrl} passHref>
          <Tooltip title="Consultar Alumno" placement="top">
            <IconButton aria-label="Consultar Alumno" component="a">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      )}
      {id && (
        <>
          <Tooltip title="Estatus de servicio social" placement="top">
            <IconButton
              aria-label="Editar estatus de servicio social"
              onClick={handleOpenMenu}
            >
              <PlaylistAddCheckIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            {opciones.map((option) => (
              <MenuItem
                key={option.id}
                selected={option.id === estatusServicioSocialId}
                onClick={() => handleSelectEstatus(option.id)}
              >
                {option.nombre}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
}

ButtonServicioSocial.propTypes = {
  id: PropTypes.number.isRequired,
  programa: PropTypes.number.isRequired,
  institucion: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  nivel: PropTypes.number,
  estatusServicioSocialId: PropTypes.number,
  onUpdated: PropTypes.func,
};

ButtonServicioSocial.defaultProps = {
  nivel: null,
  estatusServicioSocialId: null,
  onUpdated: null,
};
