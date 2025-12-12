import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, IconButton, Divider, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import {
  ButtonsForm,
  ButtonSimple,
  Context,
  createRecord,
  DefaultModal,
  Input,
  InputDate,
} from '@siiges-ui/shared';

const CircularIconButton = styled(IconButton)(({ theme, disabled }) => ({
  border: `1px solid ${
    disabled ? theme.palette.grey[300] : theme.palette.primary.main
  }`,
  borderRadius: '50%',
  padding: '6px',
  transition:
    'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    color: '#fff',
    backgroundColor: `${theme.palette.primary.main}`,
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 8px 15px',
    transform: 'translateY(-2px)',
  },
}));

export default function NavigationButtons({
  currentPosition,
  totalPositions,
  onNext,
  onPrevious,
  handleOnSubmit,
  title,
  isSubmitting,
  disabled,
  estatus,
  id,
  type,
}) {
  const [open, setOpen] = useState(false);
  const [openProcesarModal, setOpenProcesarModal] = useState(false);
  const { setNoti } = useContext(Context);
  const router = useRouter();

  const [formProcesar, setFormProcesar] = useState({
    matricula: '',
    folioExpediente: '',
    folioResolucion: '',
    fechaResolucion: '',
  });

  const [errors, setErrors] = useState({
    matricula: '',
    folioExpediente: '',
    folioResolucion: '',
    fechaResolucion: '',
  });

  const [isSubmittingProcesar, setIsSubmittingProcesar] = useState(false);

  const validateField = (name, value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo es obligatorio';
    }
    return '';
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    setFormProcesar((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleOnSubmitProcesar = async () => {
    if (!id || typeof id !== 'number') {
      setNoti({
        open: true,
        message: 'No se pudo procesar la equivalencia: ID inválido.',
      });
      return;
    }

    const newErrors = {};
    Object.entries(formProcesar).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value);
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (hasErrors) return;

    setIsSubmittingProcesar(true);

    const response = await createRecord({
      endpoint: `/solicitudesRevEquiv/${id}/procesar`,
      data: formProcesar,
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      setOpenProcesarModal(false);
      setFormProcesar({
        matricula: '',
        folioExpediente: '',
        folioResolucion: '',
        fechaResolucion: '',
      });
      setErrors({});
    } else {
      setNoti({
        open: true,
        message: `Error al procesar: ${response.errorMessage}`,
        type: 'error',
      });
    }

    setIsSubmittingProcesar(false);
  };

  const isDisabledProcesar = isSubmittingProcesar
    || Object.values(formProcesar).some((v) => !v)
    || Object.values(errors).some((e) => !!e);

  return (
    <>
      <Grid container alignItems="center" spacing={1}>
        {/* Botón regresar a la izquierda */}
        <Grid item xs="auto">
          <ButtonSimple
            text="Regresar"
            design="enviar"
            onClick={() => {
              router.back();
            }}
          />
        </Grid>

        {/* Contenedor para el resto, alineado a la derecha */}
        <Grid item xs>
          <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
            {currentPosition > 1 && (
            <>
              <Grid item>
                <CircularIconButton
                  onClick={onPrevious}
                  aria-label="Anterior"
                  sx={{
                    transform: 'rotate(180deg)',
                    '&:hover': {
                      transform: 'rotate(180deg) translateY(2px)',
                    },
                  }}
                >
                  <NavigateNextIcon />
                </CircularIconButton>
              </Grid>
              <Grid item>
                <Typography align="center">Anterior</Typography>
              </Grid>
              <Grid item>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: '2rem', mx: 4 }}
                />
              </Grid>
            </>
            )}

            {currentPosition < totalPositions && (
            <>
              <Grid item>
                <Typography align="center">Siguiente</Typography>
              </Grid>
              <Grid item>
                <CircularIconButton
                  onClick={onNext}
                  aria-label="Siguiente"
                  disabled={disabled}
                >
                  <NavigateNextIcon />
                </CircularIconButton>
              </Grid>
            </>
            )}

            {currentPosition === totalPositions && !disabled && type === null && (
            <Grid item>
              <ButtonSimple
                text="Terminar"
                onClick={() => setOpen(true)}
                disabled={isSubmitting}
              />
            </Grid>
            )}

            {currentPosition === totalPositions && type === 'edit' && (
            <Grid item>
              <ButtonSimple
                text="Editar"
                design="enviar"
                onClick={handleOnSubmit}
                disabled={isSubmitting}
              />
            </Grid>
            )}

            {estatus === 4 && currentPosition === totalPositions && (
            <Grid item>
              <ButtonSimple
                text="Procesar"
                onClick={() => setOpenProcesarModal(true)}
                disabled={isSubmitting}
              />
            </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <DefaultModal title={title} open={open} setOpen={setOpen}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>
              ¿Está seguro de que quiere terminar esta solicitud de
              revalidación? Una vez terminada no se podrá editar.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonsForm
              cancel={() => setOpen(false)}
              confirm={handleOnSubmit}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </DefaultModal>

      <DefaultModal
        title="Procesar Equivalencia Interna"
        open={openProcesarModal}
        setOpen={setOpenProcesarModal}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Input
              name="matricula"
              label="Matrícula"
              id="matricula"
              required
              value={formProcesar.matricula}
              errorMessage={errors.matricula}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="folioExpediente"
              label="Folio del Expediente"
              id="folioExpediente"
              required
              value={formProcesar.folioExpediente}
              errorMessage={errors.folioExpediente}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="folioResolucion"
              label="Folio de Resolución"
              id="folioResolucion"
              required
              value={formProcesar.folioResolucion}
              errorMessage={errors.folioResolucion}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={6}>
            <InputDate
              name="fechaResolucion"
              label="Fecha de Resolución"
              id="fechaResolucion"
              required
              value={formProcesar.fechaResolucion}
              errorMessage={errors.fechaResolucion}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonsForm
              cancel={() => setOpenProcesarModal(false)}
              confirm={handleOnSubmitProcesar}
              disabled={isDisabledProcesar || isSubmittingProcesar}
            />
          </Grid>
        </Grid>
      </DefaultModal>
    </>
  );
}

NavigationButtons.defaultProps = {
  title: 'Equivalencias',
  isSubmitting: false,
  handleOnSubmit: () => {},
  disabled: false,
  estatus: null,
  id: null,
  type: null,
};

NavigationButtons.propTypes = {
  currentPosition: PropTypes.number.isRequired,
  totalPositions: PropTypes.number.isRequired,
  estatus: PropTypes.number,
  id: PropTypes.number,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
  disabled: PropTypes.bool,
};
