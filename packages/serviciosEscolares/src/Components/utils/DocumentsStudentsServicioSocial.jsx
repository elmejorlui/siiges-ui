import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IconButton, Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useUI } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  TIPOS_DOCUMENTO_SERVICIO_SOCIAL,
} from '../ServicioSocialAlumnos/servicioSocialUtils';

const DOCUMENTOS_LABELS = {
  ARCHIVO_CARTA_ASIGNACION: 'Carta de asignación',
  ARCHIVO_INFORME_FINAL: 'Informe final',
  ARCHIVO_CARTA_LIBERACION: 'Carta de liberación',
};

export default function DocumentsStudentsServicioSocial({ documentos }) {
  const { setNoti } = useUI();

  const handleVerDocumento = (tipoDocumento, ubicacion) => {
    if (!ubicacion) {
      setNoti({
        open: true,
        message: 'No hay documento cargado para este alumno',
        type: 'error',
      });
      return;
    }

    window.open(`${process.env.NEXT_PUBLIC_URL}${ubicacion}`, '_blank');
  };

  return (
    <Stack direction="row" spacing={1}>
      {TIPOS_DOCUMENTO_SERVICIO_SOCIAL.map((documento) => {
        const ubicacion = documentos?.[documento.tipoDocumento] || null;
        const nombre = ubicacion?.split('/').pop();
        return (
          <Tooltip
            key={documento.tipoDocumento}
            title={nombre
              ? `${DOCUMENTOS_LABELS[documento.tipoDocumento]}: ${nombre}`
              : DOCUMENTOS_LABELS[documento.tipoDocumento]}
            placement="top"
          >
            <span>
              <IconButton
                onClick={() => handleVerDocumento(documento.tipoDocumento, ubicacion)}
                disabled={!ubicacion}
              >
                <PictureAsPdfIcon />
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

DocumentsStudentsServicioSocial.defaultProps = {
  documentos: null,
};

DocumentsStudentsServicioSocial.propTypes = {
  documentos: PropTypes.objectOf(PropTypes.string),
};
