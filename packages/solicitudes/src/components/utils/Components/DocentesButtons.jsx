import { IconButton, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useContext } from 'react';
import DeleteDocentes from './DocentesModales/DeleteDocentes';
import { TablesPlanEstudiosContext } from '../Context/tablesPlanEstudiosProviderContext';
import DocentesModal from './DocentesModales/DocentesModal';

export default function DocentesButtons({ id, setDocentesList, isDisabled, type }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { setFormDocentes, programaId } = useContext(TablesPlanEstudiosContext);

  const handleModalOpen = (editMode) => {
    setIsEdit(editMode);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setFormDocentes({
      esAceptado: true,
      programaId,
      asignaturasDocentes: [],
      formacionesDocentes: [],
    });
    setDeleteDialogOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  if (type === 'consultar') {
    return null;
  }
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="consultar" onClick={() => handleModalOpen(false)}>
        <DescriptionIcon />
      </IconButton>
      {!isDisabled && (
        <>
          <IconButton aria-label="editar" onClick={() => handleModalOpen(true)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="eliminar" onClick={handleDeleteDialogOpen}>
            <DeleteIcon />
          </IconButton>
        </>
      )}

      {modalOpen && (
        <DocentesModal
          hideModal={handleModalClose}
          open={modalOpen}
          id={id}
          mode={isEdit ? 'edit' : 'consult'}
          setDocentesList={setDocentesList}
        />
      )}

      {deleteDialogOpen && (
        <DeleteDocentes
          modal={deleteDialogOpen}
          hideModal={handleDeleteDialogClose}
          setDocentesList={setDocentesList}
          id={id}
        />
      )}
    </Stack>
  );
}

DocentesButtons.propTypes = {
  id: PropTypes.number.isRequired,
  setDocentesList: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};
