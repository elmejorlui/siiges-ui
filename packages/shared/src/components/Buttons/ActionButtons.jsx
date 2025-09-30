import Tooltip from '@mui/material/Tooltip';
import { IconButton, Stack } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import Link from 'next/link';

export default function ActionButtons({
  id, nonDeletablePlanteles, consultar, editar, eliminar,
}) {
  const renderButton = (link, label, icon) => {
    if (link) {
      return (
        <Tooltip title={label.charAt(0).toUpperCase() + label.slice(1)} placement="top">
          <span>
            <Link href={link}>
              <IconButton aria-label={label}>{icon}</IconButton>
            </Link>
          </span>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Stack direction="row" spacing={1}>
      {renderButton(consultar, 'consultar', <VisibilityOutlinedIcon />)}
      {renderButton(editar, 'editar', <EditIcon />)}
      {eliminar && !nonDeletablePlanteles.includes(id) && (
        <Tooltip title="Eliminar" placement="top">
          <IconButton aria-label="eliminar" onClick={eliminar}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

ActionButtons.defaultProps = {
  eliminar: null,
  nonDeletablePlanteles: [],
};

ActionButtons.propTypes = {
  id: PropTypes.number.isRequired,
  nonDeletablePlanteles: PropTypes.arrayOf(PropTypes.number),
  editar: PropTypes.string.isRequired,
  consultar: PropTypes.string.isRequired,
  eliminar: PropTypes.func,
};
