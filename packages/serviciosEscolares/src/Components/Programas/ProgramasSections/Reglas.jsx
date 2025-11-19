import React, {
  useState, useContext, useEffect,
  useRef,
} from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  Typography,
  FormHelperText,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  ButtonSimple, Context, updateRecord,
} from '@siiges-ui/shared';

export default function Reglas({
  programa,
  id,
  rules,
  onRulesChange,
}) {
  const { setNoti, setLoading } = useContext(Context);

  const [form, setForm] = useState({
    id: id || '',
    solicitudId: programa?.solicitudId || '',
    ...rules,
  });

  const [errors, setErrors] = useState({
    calificacionMinima: false,
    calificacionMaxima: false,
    calificacionAprobatoria: false,
    calificacionDecimal: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    calificacionMinima: '',
    calificacionMaxima: '',
    calificacionAprobatoria: '',
    calificacionDecimal: '',
  });

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      ...rules,
    }));
  }, [rules]);

  const validateField = (name, value) => {
    let isValid = true;
    let message = '';

    if (value === '' || value === null || typeof value === 'undefined') {
      isValid = false;
      message = 'Este campo es requerido';
    } else if (name !== 'calificacionDecimal' && Number.isNaN(Number(value))) {
      isValid = false;
      message = 'Debe ser un número válido';
    }

    setErrors((prev) => ({ ...prev, [name]: !isValid }));
    setErrorMessages((prev) => ({ ...prev, [name]: message }));
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    validateField(name, value);

    const rulesUpdate = {
      calificacionMinima: updatedForm.calificacionMinima,
      calificacionMaxima: updatedForm.calificacionMaxima,
      calificacionAprobatoria: updatedForm.calificacionAprobatoria,
      calificacionDecimal: updatedForm.calificacionDecimal,
    };
    onRulesChange(rulesUpdate);
  };
  const prevDecimalRef = useRef(form.calificacionDecimal);
  useEffect(() => {
    if (prevDecimalRef.current === form.calificacionDecimal) return;

    const formatValue = (val) => {
      if (val === '' || Number.isNaN(Number(val))) return '';
      return form.calificacionDecimal === '1'
        ? Number(val).toFixed(1)
        : String(Math.trunc(Number(val)));
    };

    setForm((prev) => ({
      ...prev,
      calificacionMinima: formatValue(prev.calificacionMinima),
      calificacionMaxima: formatValue(prev.calificacionMaxima),
      calificacionAprobatoria: formatValue(prev.calificacionAprobatoria),
    }));

    prevDecimalRef.current = form.calificacionDecimal;
  }, [form.calificacionDecimal]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    const fieldsToValidate = ['calificacionMinima', 'calificacionMaxima', 'calificacionAprobatoria', 'calificacionDecimal'];

    fieldsToValidate.forEach((field) => {
      if (
        form[field] === ''
        || form[field] === null
        || typeof form[field] === 'undefined'
      ) {
        newErrors[field] = true;
        newErrorMessages[field] = '¡Este campo es requerido!';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const formatToDecimal = (value) => parseFloat(value).toFixed(1);

  const formatValue = (value) => {
    if (value === '' || Number.isNaN(Number(value))) return '';
    return form.calificacionDecimal === '1'
      ? Number(value).toFixed(1)
      : String(Math.trunc(Number(value)));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNoti({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        type: 'error',
      });
      return;
    }

    const dataBody = {
      programa: {
        calificacionMinima: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionMinima) : form.calificacionMinima,
        calificacionMaxima: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionMaxima) : form.calificacionMaxima,
        calificacionAprobatoria: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionAprobatoria) : form.calificacionAprobatoria,
        calificacionDecimal: form.calificacionDecimal === '1',
      },
    };

    try {
      await updateRecord({
        data: dataBody,
        endpoint: `/solicitudes/${form.solicitudId}`,
      });

      setLoading(false);
      setNoti({
        open: true,
        message: '¡Reglas actualizadas con éxito!',
        type: 'success',
      });
    } catch (error) {
      setLoading(false);
      setNoti({
        open: true,
        message: `¡Error al actualizar las reglas!: ${error.message}`,
        type: 'error',
      });
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Reglas</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Mínima"
            name="calificacionMinima"
            type="number"
            value={formatValue(form.calificacionMinima)}
            onChange={handleInputChange}
            error={errors.calificacionMinima}
            fullWidth
            required
            inputProps={{ step: form.calificacionDecimal === '1' ? '0.1' : '1' }}
          />
          {errors.calificacionMinima && (
            <FormHelperText error>{errorMessages.calificacionMinima}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Máxima"
            name="calificacionMaxima"
            type="number"
            value={formatValue(form.calificacionMaxima)}
            onChange={handleInputChange}
            error={errors.calificacionMaxima}
            fullWidth
            required
            inputProps={{ step: form.calificacionDecimal === '1' ? '0.1' : '1' }}
          />
          {errors.calificacionMaxima && (
            <FormHelperText error>{errorMessages.calificacionMaxima}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Aprobatoria"
            name="calificacionAprobatoria"
            type="number"
            value={formatValue(form.calificacionAprobatoria)}
            onChange={handleInputChange}
            error={errors.calificacionAprobatoria}
            fullWidth
            required
            inputProps={{ step: form.calificacionDecimal === '1' ? '0.1' : '1' }}
          />
          {errors.calificacionAprobatoria && (
            <FormHelperText error>{errorMessages.calificacionAprobatoria}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Calificaciones Decimales"
            name="calificacionDecimal"
            value={form.calificacionDecimal}
            onChange={handleInputChange}
            error={errors.calificacionDecimal}
            fullWidth
            required
          >
            <MenuItem value="1">Si</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
          {errors.calificacionDecimal && (
            <FormHelperText error>{errorMessages.calificacionDecimal}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <ButtonSimple onClick={handleSubmit} align="right" text="Guardar" />
        </Grid>
      </Grid>
    </div>
  );
}

Reglas.propTypes = {
  id: PropTypes.number.isRequired,
  programa: PropTypes.shape({
    solicitudId: PropTypes.number,
    calificacionMinima: PropTypes.number,
    calificacionMaxima: PropTypes.number,
    calificacionAprobatoria: PropTypes.number,
    calificacionDecimal: PropTypes.bool,
  }).isRequired,
  rules: PropTypes.shape({
    calificacionMinima: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    calificacionMaxima: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    calificacionAprobatoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    calificacionDecimal: PropTypes.string,
  }).isRequired,
  onRulesChange: PropTypes.func.isRequired,
};
