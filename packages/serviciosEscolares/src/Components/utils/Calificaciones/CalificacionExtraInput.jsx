/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField, Box } from '@mui/material';

const opcionesValidas = ['NS', 'NP', 'RC', 'SD'];

export default function CalificacionExtraInput({
  id,
  value,
  disabled,
  updateCalificaciones,
  calificacionMinima,
  calificacionMaxima,
  calificacionDecimal,
}) {
  const [inputValue, setInputValue] = useState(value);
  const [autoValue, setAutoValue] = useState(value);

  const handleInputChange = (event, newInputValue) => {
    const newValue = newInputValue.toUpperCase().trim();
    setInputValue(newValue);

    if (opcionesValidas.includes(newValue)) {
      updateCalificaciones(id, newValue);
      return;
    }

    const numericValue = parseFloat(newValue);
    if (!Number.isNaN(numericValue)) {
      if (numericValue >= calificacionMinima && numericValue <= calificacionMaxima) {
        updateCalificaciones(id, newValue, 'calificacion');
      }
    }

    if (newValue === '') {
      updateCalificaciones(id, '');
    }
  };

  const handleBlur = () => {
    if (opcionesValidas.includes(inputValue)) {
      updateCalificaciones(id, inputValue);
      return;
    }

    if (calificacionDecimal) {
      const numericValue = Number(inputValue);

      if (!Number.isNaN(numericValue)) {
        let correctedValue = numericValue;

        if (correctedValue < calificacionMinima) {
          correctedValue = calificacionMinima;
        } else if (correctedValue > calificacionMaxima) {
          correctedValue = calificacionMaxima;
        }

        setInputValue(inputValue);
        updateCalificaciones(id, inputValue, 'calificacion');
        return;
      }
    }

    const numericValue = parseFloat(inputValue);
    if (!Number.isNaN(numericValue)) {
      let correctedValue = numericValue % 1 <= 0.5
        ? Math.floor(numericValue)
        : Math.ceil(numericValue);

      if (correctedValue < calificacionMinima) {
        correctedValue = calificacionMinima;
      } else if (correctedValue > calificacionMaxima) {
        correctedValue = calificacionMaxima;
      }

      setInputValue(correctedValue.toString());
      updateCalificaciones(id, correctedValue.toString(), 'calificacion');
    } else {
      setInputValue('');
      updateCalificaciones(id, '', 'calificacion');
    }
  };

  const handleChange = (event, newValue) => {
    setAutoValue(newValue || '');
    updateCalificaciones(id, newValue || '');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Autocomplete
        freeSolo
        options={opcionesValidas}
        inputValue={inputValue}
        value={autoValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        fullWidth
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            id={params.id}
            inputRef={params.InputProps.ref}
            InputProps={params.InputProps}
            InputLabelProps={params.InputLabelProps}
            placeholder={params.inputProps?.placeholder}
            variant="standard"
            fullWidth
            disabled={disabled}
            sx={{ maxWidth: '100%' }}
            onBlur={handleBlur}
          />
        )}
      />
    </Box>
  );
}

CalificacionExtraInput.defaultProps = {
  value: '',
  calificacionMinima: 0,
  calificacionMaxima: 100,
  calificacionDecimal: true,
};

CalificacionExtraInput.propTypes = {
  id: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.string,
  updateCalificaciones: PropTypes.func.isRequired,
  calificacionMinima: PropTypes.number,
  calificacionMaxima: PropTypes.number,
  calificacionDecimal: PropTypes.bool,
};
