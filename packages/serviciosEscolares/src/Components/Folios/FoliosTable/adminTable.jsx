import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Grid, IconButton } from '@mui/material';
import { DataTable } from '@siiges-ui/shared';
import ArticleIcon from '@mui/icons-material/Article';
import {
  RuleOutlined, Send, VisibilityOutlined, DoneAll,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminTable({
  tipoDocumento,
  tipoSolicitud,
  estatus,
  programa,
  plantel,
  solicitudes,
  isAdmin,
  isCeSicyt,
}) {
  const router = useRouter();

  const columns = [
    {
      field: 'id', headerName: 'ID', width: 70, hide: true,
    },
    { field: 'tipoDocumentoNombre', headerName: 'Tipo de documento', width: 180 },
    { field: 'tipoSolicitudFolio', headerName: 'Tipo solicitud', width: 150 },
    { field: 'folioSolicitud', headerName: 'Folio de captura', width: 150 },
    { field: 'programaNombre', headerName: 'Plan de estudios', width: 250 },
    {
      field: 'rvoe',
      headerName: 'RVOE',
      width: 180,
      valueGetter: (params) => params.row.rvoe || 'N/A',
    },
    { field: 'estatusSolicitudFolioNombre', headerName: 'Estatus', width: 250 },
    { field: 'plantelNombre', headerName: 'Plantel', width: 300 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => {
        const handleAddClick = () => {
          router.push(`/serviciosEscolares/solicitudesFolios/admin/${params.id}/folios`);
        };

        let IconComponent = ArticleIcon;
        let tooltipTitle = '';

        if (isAdmin || isCeSicyt) {
          if (params.row.estatusSolicitudFolioId === 1 && isAdmin) {
            IconComponent = EditIcon;
            tooltipTitle = 'Editar solicitud';
          } else if (params.row.estatusSolicitudFolioId === 2) {
            IconComponent = VisibilityOutlined;
            tooltipTitle = 'Revisar';
          } else if (params.row.estatusSolicitudFolioId === 3) {
            IconComponent = Send;
            tooltipTitle = 'Envío a titulación';
          } else if (params.row.estatusSolicitudFolioId === 7) {
            IconComponent = RuleOutlined;
            tooltipTitle = 'Envío parcial';
          } else if (params.row.estatusSolicitudFolioId === 6) {
            IconComponent = DoneAll;
            tooltipTitle = 'Envío completo';
          }
        }

        return (
          <Tooltip title={tooltipTitle} placement="top">
            <IconButton onClick={handleAddClick}>
              <IconComponent />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const mappedSolicitudes = solicitudes
    .filter((solicitud) => {
      if (isCeSicyt) {
        return solicitud.estatusSolicitudFolioId !== 1;
      }
      return true;
    })
    .map((solicitud) => ({
      id: solicitud.id,
      folioSolicitud: solicitud.folioSolicitud,
      programaId: solicitud.programa?.id,
      tipoDocumentoId: solicitud.tipoDocumentoId,
      tipoSolicitudFolioId: solicitud.tipoSolicitudFolioId,
      estatusSolicitudFolioId: solicitud.estatusSolicitudFolioId,
      programaNombre: solicitud.programa?.nombre || '',
      tipoSolicitudFolio: solicitud.tipoSolicitudFolio?.nombre || '',
      tipoDocumentoNombre: solicitud.tipoDocumento?.nombre || '',
      rvoe: solicitud.programa?.acuerdoRvoe || '',
      estatusSolicitudFolioNombre: solicitud.estatusSolicitudFolio?.nombre || '',
      plantelNombre: solicitud.programa?.plantel
        ? `${solicitud.programa.plantel.domicilio.calle} ${solicitud.programa.plantel.domicilio.numeroExterior}`
        : '',
    }));

  const filteredSolicitudes = mappedSolicitudes.filter((solicitud) => {
    const matchesTipoDocumento = !tipoDocumento || solicitud.tipoDocumentoId === tipoDocumento;
    const matchesTipoSolicitud = !tipoSolicitud || solicitud.tipoSolicitudFolioId === tipoSolicitud;
    const matchesEstatus = !estatus.length || estatus.includes(solicitud.estatusSolicitudFolioId);
    const matchesPrograma = !programa || solicitud.programaId === programa;
    const matchesPlantel = !plantel || solicitud.plantelNombre === plantel;

    // eslint-disable-next-line max-len
    return matchesTipoDocumento && matchesTipoSolicitud && matchesEstatus && matchesPrograma && matchesPlantel;
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DataTable title="Solicitudes de Folios" rows={filteredSolicitudes} columns={columns} />
      </Grid>
    </Grid>
  );
}

AdminTable.propTypes = {
  tipoDocumento: PropTypes.string,
  tipoSolicitud: PropTypes.string,
  estatus: PropTypes.arrayOf(PropTypes.string),
  programa: PropTypes.string,
  plantel: PropTypes.string,
  solicitudes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      folioSolicitud: PropTypes.string,
      programaNombre: PropTypes.string,
      estatusSolicitudFolioNombre: PropTypes.string,
      plantelNombre: PropTypes.string,
    }),
  ).isRequired,
  isAdmin: PropTypes.bool,
  isCeSicyt: PropTypes.bool,
};

AdminTable.defaultProps = {
  tipoDocumento: null,
  tipoSolicitud: null,
  estatus: [],
  programa: null,
  plantel: null,
  isAdmin: false,
  isCeSicyt: false,
};
