import { ButtonSimple, Layout, getData } from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import {
  Grid, Tabs, Tab, Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import alumnosService from '@siiges-ui/serviciosescolares/src/Components/utils/alumnosService';
import HistorialAcademico from '@siiges-ui/serviciosescolares/src/Components/Alumnos/AlumnosHistorial';
import AlumnoData from '@siiges-ui/serviciosescolares/src/Components/Alumnos/AlumnosData';
import { DocumentosAlumno, ExpedienteAlumno } from '@siiges-ui/serviciosescolares';

export default function ConsultarAlumno() {
  const router = useRouter();
  const { query } = router;
  const [alumno, setAlumno] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function fetchAlumno() {
      const { dataForm } = await alumnosService({ id: query.alumnoId, method: 'GET' });
      setAlumno(dataForm);
    }

    async function fetchHistorial() {
      const result = await getData({ endpoint: `/calificaciones/alumnos/${query.alumnoId}` });
      if (result.statusCode === 200) {
        setHistorial(result.data);
      }
    }

    if (query.alumnoId) {
      fetchAlumno();
      fetchHistorial();
    }
  }, [query.alumnoId]);

  const mostrarExpediente = alumno?.tipoTramiteId !== 7;

  const tabsConfig = [
    { label: 'Alumno', component: <AlumnoData alumno={alumno} /> },
    { label: 'Documentos', component: <DocumentosAlumno id={alumno?.id} type="view" /> },
    { label: 'Historial', component: <HistorialAcademico alumno={alumno} historial={historial} /> },
    ...(mostrarExpediente
      ? [{ label: 'Expediente', component: <ExpedienteAlumno alumno={alumno} setAlumno={setAlumno} type="view" /> }]
      : []),
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout title="Consultar Alumno">
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
          <Tabs value={value} onChange={handleChange}>
            {tabsConfig.map((tab) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            {tabsConfig[value].component}
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <ButtonSimple
            onClick={() => { router.back(); }}
            text="Regresar"
            align="right"
            design="enviar"
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
