import { Grid } from '@mui/material';
import { ConsultEquivalencia } from '@siiges-ui/revalidaciones';
import {
  ButtonSimple,
  Layout,
  updateRecord,
  Context,
  DefaultModal,
  ButtonsForm,
} from '@siiges-ui/shared';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

export default function RevisarEquivalencia() {
  const router = useRouter();
  const { query } = router;
  const { setNoti, setLoading, loading } = useContext(Context);
  const [form, setForm] = useState({ observaciones: '' });
  const [estatus, setEstatus] = useState({ estatus: null });
  const [open, setOpen] = useState(false);

  const handleOnChange = (event) => {
    setForm({ observaciones: event.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateRecord({
        endpoint: `/solicitudesRevEquiv/${query.id}`,
        data: { estatusSolicitudRevEquivId: 3 },
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        setNoti({
          open: true,
          message: '¡Solicitud enviada a firma exitosamente!',
          type: 'success',
        });
        router.back();
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

  const handleSubmitObservaciones = async () => {
    if (!form.observaciones.trim()) {
      setNoti({
        open: true,
        message: 'Debes ingresar observaciones antes de enviar.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updateRecord({
        endpoint: `/solicitudesRevEquiv/${query.id}`,
        data: {
          observaciones: form.observaciones,
          estatusSolicitudRevEquivId: 5,
        },
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        setNoti({
          open: true,
          message: '¡Observaciones enviadas exitosamente!',
          type: 'success',
        });
        router.back();
      } else {
        setNoti({
          open: true,
          message:
            response.errorMessage || '¡Error al enviar las observaciones!',
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

  return (
    <Layout title="Revisión de Solicitud de Equivalencias">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ConsultEquivalencia
            observaciones={form}
            handleOnChange={handleOnChange}
            setEstatus={setEstatus}
          />
        </Grid>
        <Grid item xs={9.45}>
          <ButtonSimple
            text="Pasar a Firma"
            onClick={handleSubmit}
            align="right"
            disabled={loading}
          />
        </Grid>
        {estatus === 2 && (
          <Grid item>
            <ButtonSimple
              text="Enviar Observaciones"
              onClick={() => {
                setOpen(true);
              }}
              align="right"
              disabled={loading}
            />
          </Grid>
        )}
        <DefaultModal
          title="Envío de observaciones"
          open={open}
          setOpen={setOpen}
        >
          Estás a punto de enviar observaciones de esta solicitud. ¿Deseas
          continuar?
          <ButtonsForm
            confirm={handleSubmitObservaciones}
            cancel={() => {
              setOpen(false);
            }}
            confirmText="Continuar"
            cancelText="Regresar"
          />
        </DefaultModal>
      </Grid>
    </Layout>
  );
}
