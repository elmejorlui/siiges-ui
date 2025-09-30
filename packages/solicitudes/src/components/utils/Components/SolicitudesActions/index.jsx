import Tooltip from '@mui/material/Tooltip';
import {
  Grid, IconButton, Typography, TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GradingIcon from '@mui/icons-material/Grading';
import PrintIcon from '@mui/icons-material/Print';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { ButtonsForm, Context, DefaultModal } from '@siiges-ui/shared';
import { deleteRecord } from '@siiges-ui/shared/src/utils/handlers/apiUtils';
import { useRouter } from 'next/router';

function SolicitudesActions({ id, estatus }) {
  const { session, setNoti } = useContext(Context);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [comments, setComments] = useState('');
  const [consultLink] = useState(`/solicitudes/detallesSolicitudes/${id}`);
  const [showButtons, setShowButtons] = useState({
    consultar: true,
    editar: false,
    eliminar: false,
    revisar: false,
    observaciones: false,
    ver: true,
    descargar: false,
  });
  const router = useRouter();
  useEffect(() => {
    switch (session.rol) {
      case 'representante':
        setShowButtons({
          ver: true,
          consultar: true,
          editar: estatus === 1 || estatus === 200,
          eliminar: estatus === 1 || estatus === 200,
        });
        break;
      case 'gestor':
        setShowButtons({
          ver: true,
          consultar: true,
          editar: estatus === 1 || estatus === 200,
          eliminar: false,
        });
        break;
      case 'control_documental':
        setShowButtons({
          ver: true,
          consultar: false,
          revisar: estatus === 3,
          editar: false,
          observaciones: estatus === 2,
          eliminar: false,
          descargar: estatus === 10,
        });
        break;
      default:
        setShowButtons({
          ver: true,
          consultar: true,
          editar: false,
          eliminar: false,
          revisar: false,
          observaciones: false,
        });
        break;
    }
  }, [session.rol]);

  const handleDelete = async () => {
    setOpenDelete(false);

    try {
      const response = await deleteRecord({ endpoint: `/solicitudes/${id}` });

      if (response.statusCode === 200) {
        setNoti({
          open: true,
          message: `¡Solicitud ${id} eliminada correctamente!`,
          type: 'success',
        });
        setTimeout(() => {
          router.replace(router.asPath);
        }, 1500);
      } else {
        setNoti({
          open: true,
          message: response.errorMessage || '¡Error al eliminar la solicitud!.',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: '¡Error interno. Inténtalo nuevamente más tarde!.',
        type: 'error',
      });
    }
  };

  const handleDownload = () => {
    setOpenDownload(false);
    setNoti({
      open: true,
      message: `Solicitud: ${id} descargada con comentarios: ${comments}`,
      type: 'success',
    });
  };

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        {showButtons.ver && (
          <Grid item xs={3}>
            <Link
              href={`/solicitudes/detallesSolicitudes/${id}/consultarSolicitud`}
              passHref
            >
              <Tooltip title="Consultar" placement="top">
                <IconButton aria-label="ver">
                  <VisibilityOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        )}
        {showButtons.consultar && (
          <Grid item xs={3}>
            <Link href={consultLink} passHref>
              <Tooltip title="Detalles" placement="top">
                <IconButton aria-label="detalles">
                  <ListAltIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        )}
        {showButtons.editar && (
          <Grid item xs={3}>
            <Link
              href={`/solicitudes/detallesSolicitudes/${id}/editarSolicitud`}
              passHref
            >
              <Tooltip title="Editar" placement="top">
                <IconButton aria-label="editar">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        )}
        {showButtons.observaciones && (
          <Grid item xs={3}>
            <Link
              href={`/solicitudes/detallesSolicitudes/${id}/observacionesSolicitud`}
              passHref
            >
              <Tooltip title="Observaciones" placement="top">
                <IconButton aria-label="observaciones">
                  <InsertCommentIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        )}
        {showButtons.revisar && (
          <Grid item xs={3}>
            <Link
              href={`/solicitudes/detallesSolicitudes/${id}/recepcionFormatos`}
              passHref
            >
              <Tooltip title="Recepción" placement="top">
                <IconButton aria-label="revisar">
                  <GradingIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        )}
        {showButtons.eliminar && (
          <Grid item xs={3}>
            <Tooltip title="Eliminar" placement="top">
              <IconButton
                aria-label="eliminar"
                onClick={() => setOpenDelete(true)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {showButtons.descargar && (
          <Grid item xs={4}>
            <Tooltip title="Descargar" placement="top">
              <IconButton
                aria-label="descargar"
                onClick={() => setOpenDownload(true)}
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <DefaultModal
        title="Eliminar solicitud"
        open={openDelete}
        setOpen={setOpenDelete}
      >
        <Typography>¿Está seguro de eliminar esta solicitud?</Typography>
        <ButtonsForm
          cancel={() => setOpenDelete(false)}
          confirm={handleDelete}
          confirmText="Confirmar"
        />
      </DefaultModal>
      <DefaultModal
        title="Descargar solicitud"
        open={openDownload}
        setOpen={setOpenDownload}
      >
        <Typography>
          ¿Está seguro de descargar esta solicitud con los siguientes
          comentarios?
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          label="Comentarios"
        />
        <ButtonsForm
          cancel={() => setOpenDownload(false)}
          confirm={handleDownload}
          confirmText="Descargar"
        />
      </DefaultModal>
    </>
  );
}

SolicitudesActions.propTypes = {
  id: PropTypes.number.isRequired,
  estatus: PropTypes.number.isRequired,
};

export default SolicitudesActions;
