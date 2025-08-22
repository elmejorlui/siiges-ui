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
      val = val.replace(/\D/g, ''); // solo números enteros
    } else {
      val = val.replace(/[^0-9.]/g, ''); // números y punto decimal
      const parts = val.split('.');
      if (parts.length > 2) {
        val = `${parts[0]}.${parts[1]}`; // evita más de un punto decimal
      }
    }

    onChange({ target: { name, value: val } });
  };

  const handleBlur = (e) => {
    const val = e.target.value;

    if (val !== '' && !Number.isNaN(val)) {
      let num = calificacionDecimal ? parseFloat(val) : parseInt(val, 10);

      if (Number.isNaN(num)) {
        num = '';
      } else {
        if (num < calificacionMinima) num = calificacionMinima;
        if (num > calificacionMaxima) num = calificacionMaxima;
      }

      onChange({ target: { name, value: num.toString() } });
    }
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
      onBlur={handleBlur}
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
