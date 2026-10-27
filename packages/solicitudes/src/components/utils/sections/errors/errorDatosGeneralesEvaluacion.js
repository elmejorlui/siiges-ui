export default function errorDatosGeneralesEvaluacion(form, setError, error) {
  const validateField = (fieldName, errorMessage, validateNumber = false) => {
    const newValue = form[fieldName];
    let isValid = true;

    if (
      newValue === undefined
      || newValue === ''
      || (validateNumber && !/^-?\d*\.?\d+$/.test(newValue))
    ) {
      setError({ ...error, [fieldName]: errorMessage });
      isValid = false;
    } else {
      setError({ ...error, [fieldName]: '' });
    }

    return isValid;
  };

  const errors = {
    fecha: () => validateField('fecha', 'Fecha de dictamen inválida'),
    evaluadorId: () => validateField('evaluadorId', 'Evaluador inválido'),
    valoracion: () => validateField('valoracion', 'Valoración cualitativa inválida'),
  };

  return errors;
}
