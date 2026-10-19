import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import {
  ButtonsForm,
  GetFile,
  Input,
  InputFile,
  Select,
  useUI,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import alumnosService from '../../utils/alumnosService';
import {
  ESTATUS_SERVICIO_SOCIAL,
  opcionesEstatusServicioSocial,
  TIPOS_DOCUMENTO_SERVICIO_SOCIAL,
} from '../servicioSocialUtils';

export default function ServicioSocialInfo({ alumno, nivelId }) {
  const router = useRouter();
  const { setNoti } = useUI();

  const [fileURLs, setFileURLs] = useState({});
  const [observaciones, setObservaciones] = useState('');
  const [estatusServicioSocial, setEstatusServicioSocial] = useState(
    ESTATUS_SERVICIO_SOCIAL.PENDIENTE.id,
  );

  const opcionesEstatus = opcionesEstatusServicioSocial(nivelId);

  useEffect(() => {
    if (!alumno?.id) return undefined;

    const estatusGuardado = alumno.estatusServicioSocial;
    const noAplicaInvalido = estatusGuardado === ESTATUS_SERVICIO_SOCIAL.NO_APLICA.id
      && nivelId !== null && nivelId !== undefined
      && !opcionesEstatusServicioSocial(nivelId).some((option) => option.id === estatusGuardado);

    setEstatusServicioSocial(noAplicaInvalido
      ? ESTATUS_SERVICIO_SOCIAL.PENDIENTE.id
      : (estatusGuardado ?? ESTATUS_SERVICIO_SOCIAL.PENDIENTE.id));
    setObservaciones(alumno.observacionesServicioSocial || '');

    return undefined;
  }, [alumno, nivelId]);

  const handleFileLoaded = useCallback((tipoDocumento, url) => {
    setFileURLs((prevURLs) => ({
      ...prevURLs,
      [tipoDocumento]: url,
    }));
  }, []);

  useEffect(() => {
    if (!alumno?.id) return undefined;

    TIPOS_DOCUMENTO_SERVICIO_SOCIAL.forEach(({ tipoDocumento }) => {
      GetFile(
        { tipoEntidad: 'ALUMNO', entidadId: alumno.id, tipoDocumento },
        (url, error) => {
          if (!error && url) {
            handleFileLoaded(tipoDocumento, url);
          }
        },
      );
    });

    return undefined;
  }, [alumno, handleFileLoaded]);

  const handleConfirm = async () => {
    try {
      await alumnosService({
        id: alumno.id,
        method: 'PATCH',
        dataBody: {
          estatusServicioSocial,
          observacionesServicioSocial: observaciones,
        },
      });

      setNoti({
        open: true,
        message: '¡Datos de servicio social guardados correctamente!',
        type: 'success',
      });
      router.back();
    } catch (error) {
      setNoti({
        open: true,
        message: error.message || '¡Error al guardar los datos de servicio social!',
        type: 'error',
      });
    }
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Estatus de Servicio Social</Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Estatus"
            name="estatusServicioSocial"
            options={opcionesEstatus}
            value={estatusServicioSocial}
            onChange={(event) => setEstatusServicioSocial(event.target.value)}
          />
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="text.secondary">
              {opcionesEstatus.some(
                (option) => option.id === ESTATUS_SERVICIO_SOCIAL.NO_APLICA.id,
              )
                ? 'De acuerdo al nivel de estudios, el servicio social '
                  + 'aplica o no aplica.'
                : 'Para el nivel de estudios de este programa, el servicio '
                  + 'social aplica (la opción "No aplica" no está disponible).'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Observaciones"
            name="observacionesServicioSocial"
            id="observacionesServicioSocial"
            multiline
            rows={4}
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Documentos del Servicio Social</Typography>
        </Grid>
        {TIPOS_DOCUMENTO_SERVICIO_SOCIAL.map((documento) => (
          <Grid item xs={12} key={documento.tipoDocumento}>
            <InputFile
              tipoEntidad="ALUMNO"
              tipoDocumento={documento.tipoDocumento}
              id={alumno.id}
              label={documento.label}
              url={fileURLs[documento.tipoDocumento]}
              setUrl={(url) => handleFileLoaded(documento.tipoDocumento, url)}
              title={`Suba su ${documento.label.replace(' (PDF)', '')}`}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <ButtonsForm
            confirm={handleConfirm}
            cancel={() => router.back()}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

ServicioSocialInfo.propTypes = {
  alumno: PropTypes.shape({
    id: PropTypes.number.isRequired,
    estatusServicioSocial: PropTypes.number,
    observacionesServicioSocial: PropTypes.string,
  }).isRequired,
  nivelId: PropTypes.number,
};

ServicioSocialInfo.defaultProps = {
  nivelId: null,
};
