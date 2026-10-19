import React, { useState } from 'react';
import { Layout, useUI, getData } from '@siiges-ui/shared';
import { Divider, Grid } from '@mui/material';
import {
  ServicioSocialReportesForm,
  ServicioSocialReporteGeneral,
  ServicioSocialReporteInstitucion,
} from '@siiges-ui/serviciosescolares';

export default function ReportesServicioSocial() {
  const { setNoti, setLoading } = useUI();
  const [tipoReporte, setTipoReporte] = useState(0);
  const [selectedInstitucion, setSelectedInstitucion] = useState('');
  const [reporteGeneral, setReporteGeneral] = useState(null);
  const [reporteInstitucion, setReporteInstitucion] = useState(null);

  const handleSearch = async () => {
    const esGeneral = tipoReporte === 0;

    if (!esGeneral && !selectedInstitucion) {
      setNoti({
        open: true,
        message: 'Selecciona una institución para realizar la búsqueda',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    const { data, errorMessage } = await getData({
      endpoint: esGeneral
        ? '/alumnos/servicioSocial/reportes/general'
        : `/alumnos/servicioSocial/reportes/instituciones/${selectedInstitucion}`,
    });
    setLoading(false);

    if (errorMessage) {
      setNoti({
        open: true,
        message: errorMessage,
        type: 'error',
      });
      return;
    }

    if (esGeneral) {
      setReporteGeneral(data);
      setReporteInstitucion(null);
    } else {
      setReporteInstitucion(data);
      setReporteGeneral(null);
    }
    setNoti({
      open: true,
      message: 'Búsqueda completada',
      type: 'success',
    });
  };

  return (
    <Layout title="Reportes Servicio Social">
      <Grid container>
        <Grid item xs={12}>
          <ServicioSocialReportesForm
            tipoReporte={tipoReporte}
            setTipoReporte={setTipoReporte}
            selectedInstitucion={selectedInstitucion}
            setSelectedInstitucion={setSelectedInstitucion}
            onSearch={handleSearch}
            setLoading={setLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ marginTop: 2 }} />
        </Grid>
        <Grid item xs={12}>
          {reporteGeneral && <ServicioSocialReporteGeneral data={reporteGeneral} />}
          {reporteInstitucion && (
            <ServicioSocialReporteInstitucion data={reporteInstitucion} />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
