import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { ButtonsForm, ButtonSimple, DefaultModal } from '@siiges-ui/shared';

export default function ButtonsFolios({
  save,
  cancel,
  send,
  disabled,
  saved,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <ButtonSimple
          text="Regresar"
          onClick={cancel}
          design="cancel"
          align="left"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Grid container justifyContent="flex-end" spacing={2}>
          {!disabled && (
            !saved ? (
              <Grid item>
                <ButtonSimple text="Guardar" onClick={save} />
              </Grid>
            ) : (
              <Grid item>
                <ButtonSimple
                  text="Enviar Solicitud"
                  onClick={() => setOpen(true)}
                />
              </Grid>
            )
          )}
        </Grid>
      </Grid>

      <DefaultModal title="Enviar solicitud" open={open} setOpen={setOpen}>
        <Typography sx={{ mb: 2 }}>
          ¿Está seguro de enviar la solicitud? Una vez enviada, ya no podrá ser
          editada.
        </Typography>
        <ButtonsForm
          cancel={() => setOpen(false)}
          confirm={async () => {
            const response = await send();
            if (
              response
              && (response.statusCode === 200 || response.statusCode === 201)
            ) {
              setOpen(false);
            }
          }}
        />
      </DefaultModal>
    </Grid>
  );
}

ButtonsFolios.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
};
