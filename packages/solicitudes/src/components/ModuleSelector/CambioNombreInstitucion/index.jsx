import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import {
  ButtonSimple, Select, useApi, useAuth, useUI,
} from '@siiges-ui/shared';

function CambioNombreInstitucion() {
  const { session } = useAuth();
  const { setNoti } = useUI();
  const { id } = session;
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState([]);
  const [institucionSelect, setInstitucionSelect] = useState('');
  const [solicitudSelect, setSolicitudSelect] = useState('');
  const [url, setUrl] = useState('');
  const [dataBody, setDataBody] = useState('');
  const [method, setMethod] = useState('GET');

  const { data } = useApi({
    endpoint: url || `api/v1/solicitudes?estatusSolicitudId=11&usuarioId=${id}`,
    dataBody,
    method,
  });

  const showCrearSolicitud = process.env.NEXT_PUBLIC_SHOW_CREAR_SOLICITUD !== 'false';

  useEffect(() => {
    if (method === 'GET' && Array.isArray(data)) {
      setSolicitudes(data);
    }
    if (method === 'POST' && data && !Array.isArray(data)) {
      setNoti({ open: true, message: '¡Registro Exitoso!', type: 'success' });
      router.push({
        pathname: `/solicitudes/detallesSolicitudes/${data.id}/editarSolicitud`,
        query: { solicitudType: 'Cambio de Nombre de Institución' },
      }, `/solicitudes/detallesSolicitudes/${data.id}/editarSolicitud`);
    }
  }, [data]);

  const institucionOptions = useMemo(() => {
    const map = new Map();
    solicitudes.forEach(({ programa }) => {
      const inst = programa?.plantel?.institucion;
      if (inst) map.set(inst.id, { id: inst.id, nombre: inst.nombre });
    });
    return [...map.values()];
  }, [solicitudes]);

  const programaOptions = useMemo(() => solicitudes
    .filter(({ programa }) => programa?.plantel?.institucion?.id === institucionSelect)
    .map(({ id: solicitudId, folio, programa }) => ({
      id: solicitudId,
      nombre: `${programa.nombre} ${folio}`,
    })), [solicitudes, institucionSelect]);

  const handleOnClick = () => {
    if (solicitudSelect) {
      setMethod('POST');
      setDataBody({ tipoSolicitudId: 6 });
      setUrl(`api/v1/solicitudes/${solicitudSelect}/cambioNombreInstitucion`);
    }
  };

  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Select
            title="Institución"
            name="institucion"
            options={institucionOptions}
            value={institucionSelect}
            onChange={(e) => {
              setInstitucionSelect(e.target.value || '');
              setSolicitudSelect('');
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <Select
            title="Programa"
            name="programa"
            options={programaOptions}
            value={solicitudSelect}
            onChange={(e) => setSolicitudSelect(e.target.value || '')}
          />
        </Grid>
        <Grid item xs={2} sx={{ mt: 2, mb: 1 }}>
          <ButtonSimple text="Crear" onClick={handleOnClick} disabled={!showCrearSolicitud} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CambioNombreInstitucion;
