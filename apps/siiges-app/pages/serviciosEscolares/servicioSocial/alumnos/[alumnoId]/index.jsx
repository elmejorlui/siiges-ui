import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Tab, Tabs } from '@mui/material';
import { DatosAlumno, ServicioSocialInfo } from '@siiges-ui/serviciosescolares';
import { Layout, useUI } from '@siiges-ui/shared';
import alumnosService from '@siiges-ui/serviciosescolares/src/Components/utils/alumnosService';
import getProgramaById from '@siiges-ui/serviciosescolares/src/Components/ServicioSocialAlumnos/getProgramaById';

export default function EditarAlumnoServicioSocial() {
  const router = useRouter();
  const { query } = router;
  const { setNoti } = useUI();
  const [alumno, setAlumno] = useState(null);
  const [nivelId, setNivelId] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function inicializar() {
      try {
        const { dataForm } = await alumnosService({
          id: query.alumnoId,
          method: 'GET',
        });
        setAlumno(dataForm);

        if (query.nivel) {
          setNivelId(Number(query.nivel));
        } else {
          const { nivelId: nivelPrograma } = await getProgramaById(dataForm.programaId);
          setNivelId(nivelPrograma);
        }
      } catch (error) {
        setNoti({
          open: true,
          message: error.message || 'No se pudo obtener la información del alumno',
          type: 'error',
        });
      }
    }

    if (query.alumnoId) {
      inicializar();
    }
  }, [query]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout title="Servicio Social de Alumno">
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Datos del Alumno" />
            <Tab label="Servicio Social" />
          </Tabs>
        </Grid>
        {value === 0 && <DatosAlumno alumno={alumno} />}
        {value === 1 && <ServicioSocialInfo alumno={alumno} nivelId={nivelId} />}
      </Grid>
    </Layout>
  );
}
