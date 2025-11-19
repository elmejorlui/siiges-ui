import { Grid, Typography } from '@mui/material';
import { GetFile, InputFile } from '@siiges-ui/shared';
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import useSectionDisabled from './Hooks/useSectionDisabled';

export default function AnexosSeccion({
  disabled,
  id,
  type,
  institucionId,
  usuarioId,
  plantelId,
  programaId,
  tipoSolicitudId,
}) {
  const [fileURLs, setFileURLs] = useState([]);
  const isSectionDisabled = useSectionDisabled(20);
  const isDisabled = disabled || isSectionDisabled;

  const tiposDocumentos = [
    {
      tipoDocumento: 'IDENTIFICACION_REPRESENTANTE',
      label: 'Identificación oficial con fotografía / Acta constitutiva',
      tipoEntidad: 'REPRESENTANTE',
      entidad: () => usuarioId,
    },
    {
      tipoDocumento: 'COMPROBANTE_PAGO_RVOE',
      label: 'Comprobante de pago',
      tipoEntidad: 'SOLICITUD',
      entidad: () => id,
    },
    {
      tipoDocumento: 'FOTOGRAFIA_INMUEBLE',
      label: 'Fotografías inmuebles',
      tipoEntidad: 'PLANTEL',
      entidad: () => plantelId,
    },
    {
      tipoDocumento: 'CONSTANCIA_INFEJAL',
      label: 'Constancia INFEJAL',
      tipoEntidad: 'PLANTEL',
      entidad: () => plantelId,
    },
    {
      tipoDocumento: 'LICENCIA_MUNICIPAL',
      label: 'Licencia municipal',
      tipoEntidad: 'PLANTEL',
      entidad: () => plantelId,
    },
    {
      tipoDocumento: 'DICTAMEN_IMPI',
      label: 'Dictamen del Instituto Mexicano de Propiedad Intelectual (IMPI)',
      tipoEntidad: 'INSTITUCION',
      entidad: () => institucionId,
    },
    {
      tipoDocumento: 'SECRETARIA_SALUD',
      label:
        'Aviso funcionamiento de Secretaría de Salud ó Carta bajo protesta de decir verdad de NO venta de alimentos.',
      tipoEntidad: 'PLANTEL',
      entidad: () => plantelId,
    },
    {
      tipoDocumento: 'COMPROBANTE_TELEFONO',
      label: 'Comprobante de línea telefónica',
      tipoEntidad: 'PLANTEL',
      entidad: () => plantelId,
    },
    {
      tipoDocumento: 'PROYECTO_VINCULACION',
      label: 'Proyecto de vinculación y movilidad',
      tipoEntidad: 'PROGRAMA',
      entidad: () => programaId,
    },
    {
      tipoDocumento: 'PLAN_MEJORA',
      label: 'Plan de mejora',
      tipoEntidad: 'PROGRAMA',
      entidad: () => programaId,
    },
    {
      tipoDocumento: 'PROGRAMA_SUPERACION',
      label: 'Programa de superación',
      tipoEntidad: 'PROGRAMA',
      entidad: () => programaId,
    },
  ];

  const filteredDocumentos = useMemo(() => {
    if (tipoSolicitudId === 2) {
      const permitidos = [
        'IDENTIFICACION_REPRESENTANTE',
        'PROYECTO_VINCULACION',
        'PLAN_MEJORA',
        'PROGRAMA_SUPERACION',
      ];
      return tiposDocumentos.filter((doc) => permitidos.includes(doc.tipoDocumento));
    }
    return tiposDocumentos;
  }, [tipoSolicitudId]);

  useEffect(() => {
    setFileURLs(Array(filteredDocumentos.length).fill(null));
  }, [filteredDocumentos]);

  useEffect(() => {
    if ((type !== 'editar' && type !== 'consultar') || !id) return;

    const fetchFiles = async () => {
      await Promise.all(
        filteredDocumentos.map(async ({ tipoDocumento, tipoEntidad, entidad }, index) => {
          const entidadId = entidad();
          if (!entidadId) return;

          GetFile({ tipoEntidad, tipoDocumento, entidadId }, (url, err) => {
            if (!err) {
              setFileURLs((urls) => {
                const updated = [...urls];
                updated[index] = url;
                return updated;
              });
            }
          });
        }),
      );
    };

    fetchFiles();
  }, [filteredDocumentos, type, id, institucionId, usuarioId, plantelId, programaId]);

  const handleFileLoaded = (index, url) => {
    setFileURLs((prev) => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Anexos</Typography>
      </Grid>

      <Grid container spacing={2} sx={{ ml: 15, width: '100%' }}>
        {filteredDocumentos.map(({
          tipoDocumento, label, tipoEntidad, entidad,
        }, index) => (
          <Grid item xs={12} key={tipoDocumento}>
            <InputFile
              tipoEntidad={tipoEntidad}
              tipoDocumento={tipoDocumento}
              id={entidad()}
              url={fileURLs[index] || ''}
              setUrl={(url) => handleFileLoaded(index, url)}
              disabled={isDisabled}
              label={label}
            />
            {tipoDocumento === 'IDENTIFICACION_REPRESENTANTE' && (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              En el caso de ser persona física anexar la Identificación oficial; en caso de
              contar con razón social o persona moral, anexar el acta constitutiva junto con la
              Identificación oficial del representante legal.
            </Typography>
            )}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

AnexosSeccion.defaultProps = {
  id: null,
  institucionId: null,
  plantelId: null,
  usuarioId: null,
  programaId: null,
  type: 'crear',
};

AnexosSeccion.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.number,
  institucionId: PropTypes.number,
  plantelId: PropTypes.number,
  usuarioId: PropTypes.number,
  programaId: PropTypes.number,
  tipoSolicitudId: PropTypes.number.isRequired,
  type: PropTypes.string,
};
