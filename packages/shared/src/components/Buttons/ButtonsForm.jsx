import React from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import '../../styles/buttons/ButtonAdd.css';

export default function UserForm({
  confirm,
  cancel,
  confirmDisabled,
  confirmText,
  cancelText,
  justifyContent,
}) {
  const cancelButtonText = confirmDisabled ? 'Regresar' : cancelText;

  return (
    <Grid container justifyContent={justifyContent} spacing={2}>
      <Grid item>
        <ButtonUnstyled className="buttonAdd cancel" onClick={cancel}>
          <Typography variant="body1">{cancelButtonText}</Typography>
        </ButtonUnstyled>
      </Grid>
      {!confirmDisabled && (
        <Grid item>
          <ButtonUnstyled className="buttonAdd guardar" onClick={confirm}>
            <Typography variant="body1">{confirmText}</Typography>
          </ButtonUnstyled>
        </Grid>
      )}
    </Grid>
  );
}

UserForm.propTypes = {
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  confirmDisabled: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  justifyContent: PropTypes.string,
};

UserForm.defaultProps = {
  confirmDisabled: false,
  confirmText: 'Guardar',
  cancelText: 'Cancelar',
  justifyContent: 'flex-end',
};
