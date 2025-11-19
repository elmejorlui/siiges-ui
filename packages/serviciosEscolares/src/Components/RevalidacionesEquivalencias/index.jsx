import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useEffect, useState } from 'react';
import {
  Divider, Grid, IconButton, Paper, Typography,
} from '@mui/material';
import {
  ButtonsForm,
  Context,
  DataTable,
  DefaultModal,
  getData,
  Select,
  updateRecord,
} from '@siiges-ui/shared';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GradingIcon from '@mui/icons-material/Grading';
import SendIcon from '@mui/icons-material/Send';
import { useRouter } from 'next/router';

const tipoConsulta = [
  { id: 1, nombre: 'Revalidaciones' },
  { id: 2, nombre: 'Equivalencias' },
];

const ESTATUS_MAP = {
  1: 'Recibida',
  2: 'En Revisión',
  3: 'En Firma',
  4: 'Procesada',
  5: 'Atender observaciones',
  6: 'Cancelada',
};

const getColumns = (handleConsultar, handleRevisar, handleProcesar) => [
  { field: 'id', headerName: 'ID', hide: true },
  { field: 'folioSolicitud', headerName: 'Folio', width: 200 },
  { field: 'estatusSolicitud', headerName: 'Estatus', width: 150 },
  { field: 'nombre', headerName: 'Nombre', width: 550 },
  { field: 'fecha', headerName: 'Fecha', width: 100 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 100,
    renderCell: (params) => (
      <>
        <Tooltip title="Consultar" placement="top">
          <IconButton onClick={() => handleConsultar(params.row)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
        {params.row.estatusSolicitudRevEquivId < 3 && (
          <Tooltip title="Revisar" placement="top">
            <IconButton onClick={() => handleRevisar(params.row)}>
              <GradingIcon />
            </IconButton>
          </Tooltip>
        )}
        {params.row.estatusSolicitudRevEquivId === 3 && (
          <Tooltip title="Procesar" placement="top">
            <IconButton onClick={() => handleProcesar(params.row)}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        )}
      </>
    ),
  },
];

export default function RevalidacionEquivalencias() {
  const [tipoConsultaId, setTipoConsultaId] = useState(null);
  const { setNoti, setLoading } = useContext(Context);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(false);
  const [count, setCount] = useState({
    recibidas: 0,
    proceso: 0,
    expedidas: 0,
  });
  const router = useRouter();

  const mapApiDataToRows = (apiData) => apiData.map((item) => ({
    ...item,
    estatusSolicitud:
        ESTATUS_MAP[item.estatusSolicitudRevEquivId] || 'Desconocido',
    nombre: `${item?.interesado?.persona?.nombre} ${
      item?.interesado?.persona?.apellidoPaterno
    } ${item?.interesado?.persona?.apellidoMaterno || ''}`,
    fecha: new Date(item.createdAt).toLocaleDateString(),
  }));

  useEffect(() => {
    const fetchData = async () => {
      if (!tipoConsultaId) return;

      const endpoint = tipoConsultaId === 1
        ? '/solicitudesRevEquiv?tipoTramiteId=3&tipoTramiteId=4&tipoTramiteId=6'
        : '/solicitudesRevEquiv?tipoTramiteId=1&tipoTramiteId=2&tipoTramiteId=5';

      const response = await getData({ endpoint });
      if (response.statusCode === 200) {
        const data = response.data || [];
        const mappedData = mapApiDataToRows(data);
        setRows(mappedData);

        setCount({
          recibidas: data.length,
          proceso: data.filter((item) => item.estatusSolicitudRevEquivId === 1)
            .length,
          expedidas: data.filter(
            (item) => item.estatusSolicitudRevEquivId === 2,
          ).length,
        });
        setLoading(false);
      } else {
        setNoti({
          open: true,
          message: '¡No se encontraron datos!',
          type: 'warning',
        });
        setRows([]);
        setCount({
          recibidas: 0,
          proceso: 0,
          expedidas: 0,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [tipoConsultaId]);

  const handleTipoConsultaChange = (event) => {
    setLoading(true);
    setTipoConsultaId(event.target.value);
  };

  const handleConsultar = (rowData) => {
    if (!rowData || !rowData.id) return;

    const basePath = `/serviciosEscolares/revalidacionEquivalencias/${rowData.id}`;
    const route = tipoConsultaId === 1
      ? `${basePath}/Revalidacion/consultar`
      : `${basePath}/Equivalencias/consultar`;
    router.push(route);
  };

  const handleRevisar = (rowData) => {
    if (!rowData || !rowData.id) return;

    setId(rowData.id);

    if (rowData.estatusSolicitudRevEquivId === 2) {
      const basePath = `/serviciosEscolares/revalidacionEquivalencias/${rowData.id}`;
      const route = tipoConsultaId === 1
        ? `${basePath}/Revalidacion/revisar`
        : `${basePath}/Equivalencias/revisar`;

      router.push(route);
    } else {
      setOpen(true);
    }
  };

  const handleRevisarSuccess = async () => {
    if (!id) return;
    setOpen(false);
    setLoading(true);

    try {
      const response = await updateRecord({
        endpoint: `/solicitudesRevEquiv/${id}`,
        data: { estatusSolicitudRevEquivId: 2 },
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        setNoti({
          open: true,
          message: '¡Solicitud actualizada correctamente!',
          type: 'success',
        });

        const basePath = `/serviciosEscolares/revalidacionEquivalencias/${id}`;
        const route = tipoConsultaId === 1
          ? `${basePath}/Revalidacion/revisar`
          : `${basePath}/Equivalencias/revisar`;

        router.push(route);
      } else {
        setNoti({
          open: true,
          message:
            response.errorMessage || '¡Error al actualizar la solicitud!',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: '¡Error al procesar la solicitud!',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcesar = (rowData) => {
    if (!rowData || !rowData.id) return;

    const basePath = `/serviciosEscolares/revalidacionEquivalencias/${rowData.id}`;
    const route = tipoConsultaId === 1
      ? `${basePath}/Revalidacion/procesar`
      : `${basePath}/Equivalencias/procesar`;
    router.push(route);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Select
          name="tipoConsulta"
          options={tipoConsulta}
          title="Tipo de Consulta"
          onChange={handleTipoConsultaChange}
        />
      </Grid>
      {tipoConsultaId && (
        <>
          <Grid item xs={12}>
            <Paper sx={{ p: 1, height: 90 }} elevation={3}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Estadisticas de
                    {' '}
                    {tipoConsultaId === 1 ? 'Revalidaciones' : 'Equivalencias'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h7">
                    Recibidas:
                    {' '}
                    {count.recibidas}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h7">
                    En proceso:
                    {' '}
                    {count.proceso}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h7">
                    Expedidas:
                    {' '}
                    {count.expedidas}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <DataTable
              title={tipoConsultaId === 1 ? 'Revalidaciones' : 'Equivalencias'}
              rows={rows}
              columns={getColumns(
                handleConsultar,
                handleRevisar,
                handleProcesar,
              )}
            />
          </Grid>
        </>
      )}
      <DefaultModal
        title="Confirmar envío a revisión"
        open={open}
        setOpen={setOpen}
      >
        Estás a punto de enviar esta solicitud al proceso de revisión. ¿Deseas
        continuar?
        <ButtonsForm
          confirm={handleRevisarSuccess}
          confirmText="Continuar"
          cancel={() => {
            setOpen(false);
          }}
          cancelText="Regresar"
        />
      </DefaultModal>
    </Grid>
  );
}
