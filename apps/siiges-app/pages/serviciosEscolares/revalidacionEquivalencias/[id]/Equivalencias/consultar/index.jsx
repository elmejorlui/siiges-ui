import { Grid } from '@mui/system';
import { ConsultEquivalencia } from '@siiges-ui/revalidaciones';
import { Layout } from '@siiges-ui/shared';
import React, { useState } from 'react';

export default function ConsultarEquivalencia() {
  const [estatus, setEstatus] = useState({ estatus: null });
  return (
    <Layout title="Consultar Solicitud de Equivalencias">
      <Grid container>
        <Grid item xs={12}>
          <ConsultEquivalencia estatus={estatus} setEstatus={setEstatus} />
        </Grid>
      </Grid>
    </Layout>
  );
}
