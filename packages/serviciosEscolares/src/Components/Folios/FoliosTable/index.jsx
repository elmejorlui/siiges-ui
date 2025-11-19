import Tooltip from '@mui/material/Tooltip';
import { Grid, IconButton } from '@mui/material';
import { Context, DataTable } from '@siiges-ui/shared';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';

const solicitudesTitulos = [
  { id: 1, nombre: 'Duplicado' },
  { id: 3, nombre: 'Total' },
];

const solicitudesCertificados = [
  { id: 1, nombre: 'Duplicado' },
  { id: 2, nombre: 'Parcial' },
  { id: 3, nombre: 'Total' },
];

const columns = (handleEdit, handleConsultar) => [
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
  { field: 'estatusSolicitudFolioNombre', headerName: 'Estatus', width: 150 },
  { field: 'plantel', headerName: 'Plantel', width: 300 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <>
        <Tooltip title="Consultar" placement="top">
          <IconButton onClick={() => handleConsultar(params.row.id)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
        {(params.row.estatusSolicitudFolioNombre === 'EN CAPTURA'
          || params.row.estatusSolicitudFolioNombre === 'ATENDER OBSERVACIONES') && (
            <Tooltip title="Editar" placement="top">
              <IconButton onClick={() => handleEdit(params.row.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
        )}
      </>
    ),
  },
];

function FoliosTable({
  tipoDocumento, tipoSolicitud, programa, plantel, solicitudes,
}) {
  const router = useRouter();
  const { session } = useContext(Context);

  const showCrearFolio = process.env.NEXT_PUBLIC_SHOW_CREAR_FOLIO !== 'false';

  const navigateTo = (id, status) => {
    const routeBase = tipoDocumento === 1 ? 'titulos' : 'certificados';
    const path = status === 'create'
      ? `/serviciosEscolares/solicitudesFolios/createFolio/${routeBase}`
      : `/serviciosEscolares/solicitudesFolios/${id}/${routeBase}`;

    router.push(
      {
        pathname: path,
        query: {
          tipoDocumento, tipoSolicitud, programa, status, plantel,
        },
      },
      path,
    );
  };

  const handleEdit = (id) => navigateTo(id, 'edit');
  const handleConsultar = (id) => navigateTo(id, 'consult');

  const formattedSolicitudes = solicitudes
    .filter((solicitud) => !(session?.rol === 'ce_sicyt' && solicitud.estatusSolicitudFolio.id === 1))
    .map((solicitud) => {
      const mapArray = tipoDocumento === 1 ? solicitudesTitulos : solicitudesCertificados;
      const tipoSolicitudNombre = mapArray.find((s) => s.id === solicitud.tipoSolicitudFolio?.id)?.nombre || 'Sin tipo';

      return {
        ...solicitud,
        programaNombre: solicitud.programa.nombre,
        estatusSolicitudFolioNombre: solicitud.estatusSolicitudFolio.nombre,
        plantel:
          solicitud.programa?.plantel?.institucion?.nombre
          || solicitud.plantel?.institucion?.nombre
          || 'Sin nombre',
        tipoSolicitudFolio: tipoSolicitudNombre,
        tipoDocumentoNombre: solicitud.tipoDocumento?.nombre || '',
        rvoe: solicitud.programa?.acuerdoRvoe || '',
      };
    });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DataTable
          buttonAdd={showCrearFolio}
          buttonClick={() => navigateTo(null, 'create')}
          buttonText="Agregar Solicitud"
          title="Solicitudes de Títulos"
          rows={formattedSolicitudes}
          columns={columns(handleEdit, handleConsultar)}
        />
      </Grid>
    </Grid>
  );
}

FoliosTable.propTypes = {
  tipoDocumento: PropTypes.number.isRequired,
  tipoSolicitud: PropTypes.number.isRequired,
  programa: PropTypes.number.isRequired,
  plantel: PropTypes.string.isRequired,
  solicitudes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      folioSolicitud: PropTypes.string.isRequired,
      tipoSolicitudFolio: PropTypes.shape({ id: PropTypes.number }),
      programa: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        plantel: PropTypes.shape({
          institucion: PropTypes.shape({ nombre: PropTypes.string.isRequired }),
        }),
      }).isRequired,
      // eslint-disable-next-line max-len
      estatusSolicitudFolio: PropTypes.shape({ id: PropTypes.number, nombre: PropTypes.string.isRequired }).isRequired,
      plantel: PropTypes.shape({
        institucion: PropTypes.shape({ nombre: PropTypes.string }),
      }),
    }),
  ).isRequired,
};

export default FoliosTable;
