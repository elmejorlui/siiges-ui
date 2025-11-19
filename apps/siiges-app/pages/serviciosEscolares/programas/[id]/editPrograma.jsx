import { ButtonSimple, DefaultModal, Layout } from '@siiges-ui/shared';
import {
  Asignaturas,
  CiclosEscolares,
  Grupos,
  ProgramasData,
  Reglas,
} from '@siiges-ui/serviciosescolares';
import { useRouter } from 'next/router';
import { useProgramaById } from '@siiges-ui/solicitudes';
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Tab, Tabs, Typography,
} from '@mui/material';

export default function EditPrograma() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(true);
  const { query } = router;
  const programa = useProgramaById(query.id);

  const [rules, setRules] = useState({
    calificacionMinima: '',
    calificacionMaxima: '',
    calificacionAprobatoria: '',
    calificacionDecimal: '2',
  });

  useEffect(() => {
    if (programa) {
      setRules({
        calificacionMinima:
          programa.calificacionMinima !== null && programa.calificacionMinima !== undefined
            ? programa.calificacionMinima
            : '',
        calificacionMaxima:
          programa.calificacionMaxima !== null && programa.calificacionMaxima !== undefined
            ? programa.calificacionMaxima
            : '',
        calificacionAprobatoria:
          programa.calificacionAprobatoria !== null && programa.calificacionAprobatoria
          !== undefined
            ? programa.calificacionAprobatoria
            : '',
        calificacionDecimal: programa.calificacionDecimal ? '1' : '2',
      });
    }
  }, [programa]);

  const handleRulesChange = (updatedRules) => {
    setRules(updatedRules);
  };

  const tabsConfig = [
    { label: 'Programa', component: <ProgramasData programa={programa} id={query.id} /> },
    { label: 'Ciclos Escolares', component: <CiclosEscolares /> },
    { label: 'Grupos', component: <Grupos /> },
    {
      label: 'Reglas',
      component: (
        <Reglas
          programa={programa}
          id={query.id}
          rules={rules}
          onRulesChange={handleRulesChange}
        />
      ),
    },
    { label: 'Asignaturas', component: <Asignaturas /> },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout title=" Modificar Programas">
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
            {tabsConfig.map((tab) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
        </Grid>
        {tabsConfig[value].component}
      </Grid>
      <DefaultModal open={open} setOpen={setOpen} title="Notificación">
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Para registrar información en los RVOES autorizados las IES deberán
            cumplir con los siguientes requisitos autorizados:
          </Typography>
        </Box>
        <Box component="ol" sx={{ pl: 3 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">Nombramiento de director</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">Clave de centro de trabajo</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">Registro de sellos y firma (DGP)</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">Reglamento</Typography>
          </Box>
        </Box>
        <ButtonSimple
          onClick={() => { setOpen(false); }}
          text="Entendido"
          align="right"
        />
      </DefaultModal>
    </Layout>
  );
}
