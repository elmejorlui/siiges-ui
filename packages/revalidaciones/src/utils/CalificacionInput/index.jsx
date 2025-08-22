import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

export default function CalificacionInput({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  calificacionMinima = 0,
  calificacionMaxima = 100,
  calificacionDecimal = true,
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    if (!calificacionDecimal) {
      val = val.replace(/\D/g, '');
    } else {
      val = val.replace(/[^0-9.]/g, '');
      const parts = val.split('.');
      if (parts.length > 2) {
        val = `${parts[0]}.${parts[1]}`;
      }
    }

    // Validación de rango
    if (val !== '' && !Number.isNaN(val)) {
      let num = calificacionDecimal ? parseFloat(val) : parseInt(val, 10);
      if (num < calificacionMinima) num = calificacionMinima;
      if (num > calificacionMaxima) num = calificacionMaxima;
      val = num.toString();
    }

    onChange({ target: { name, value: val } });
  };

  return (
    <TextField
      margin="normal"
      fullWidth
      size="small"
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      inputProps={{
        inputMode: calificacionDecimal ? 'decimal' : 'numeric',
      }}
    />
  );
}

CalificacionInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  calificacionMinima: PropTypes.number,
  calificacionMaxima: PropTypes.number,
  calificacionDecimal: PropTypes.bool,
};

CalificacionInput.defaultProps = {
  label: '',
  value: '',
  disabled: false,
  calificacionMinima: 0,
  calificacionMaxima: 100,
  calificacionDecimal: true,
};
