import { Grid, Typography } from '@mui/material';
import { Input } from '@siiges-ui/shared';
import React, { useContext } from 'react';
import PlantelContext from '../utils/Context/plantelContext';
import formPrograma from '../utils/sections/forms/formPrograma';

export default function RatificacionNombre() {
  const { form, setForm } = useContext(PlantelContext);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    formPrograma(name, value, setForm, 3);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Ratificacion de nombre</Typography>
      </Grid>
      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        <Grid item xs={12}>
          <Input
            id="nombreSolicitado"
            label="Nombre solicitado"
            name="nombreSolicitado"
            auto="nombreSolicitado"
            value={form[6].nombreSolicitado}
            onchange={handleOnChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="nombreAutorizado"
            label="Nombre autorizado"
            name="nombreAutorizado"
            auto="nombreAutorizado"
            value={form[6].nombreAutorizado}
            onchange={handleOnChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="acuerdo"
            label="Acuerdo"
            name="acuerdo"
            auto="acuerdo"
            value={form[6].acuerdo}
            onchange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="instanciaAutoriza"
            label="Instancia que autoriza"
            name="instanciaAutoriza"
            auto="instanciaAutoriza"
            value={form[6].instanciaAutoriza}
            onchange={handleOnChange}
            required
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
