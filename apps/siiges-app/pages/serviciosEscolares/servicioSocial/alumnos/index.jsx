import { Layout } from '@siiges-ui/shared';
import {
  ServicioSocialForm, ServicioSocialTable,
} from '@siiges-ui/serviciosescolares';
import { Divider } from '@mui/material';
import React, { useState } from 'react';

export default function ServicioSocialAlumnos() {
  const [institucion, setInstitucion] = useState();
  const [alumnos, setAlumnos] = useState();
  const [programa, setPrograma] = useState();
  const [nivel, setNivel] = useState();
  const [loading, setLoading] = useState(true);

  return (
    <Layout title="Servicio Social - Alumnos" loading={loading}>
      <ServicioSocialForm
        setInstitucion={setInstitucion}
        setAlumnos={setAlumnos}
        setPrograma={setPrograma}
        setNivel={setNivel}
        setLoading={setLoading}
      />
      <Divider sx={{ marginTop: 2 }} />
      {alumnos && (
        <ServicioSocialTable
          alumnos={alumnos}
          programa={programa}
          institucion={institucion}
          nivel={nivel}
        />
      )}
    </Layout>
  );
}
