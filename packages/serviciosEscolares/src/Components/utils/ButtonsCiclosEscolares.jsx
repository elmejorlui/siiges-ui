import { Stack, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CiclosEscolaresModal from './CiclosEscolaresModal';
import DeleteCicloEscolar from './DeleteCiclosEscolares';

export default function ButtonsCiclosEscolares({ row, handleSuccess }) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Editar" placement="top">
          <IconButton
            aria-label="Editar Ciclo escolar"
            onClick={() => setOpenEdit(true)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <DeleteCicloEscolar id={row.id} onSuccess={handleSuccess} />
      </Stack>

      <CiclosEscolaresModal
        open={openEdit}
        setOpen={setOpenEdit}
        onSuccess={handleSuccess}
        type="edit"
        data={row}
      />
    </>
  );
}

ButtonsCiclosEscolares.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  handleSuccess: PropTypes.func.isRequired,
};
