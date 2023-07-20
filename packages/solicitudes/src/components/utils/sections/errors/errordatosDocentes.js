export default function errorDatosDocentes(form, setError) {
  const errors = {
    tipoDocente: () => {
      if (form.tipoDocente === undefined || form.tipoDocente === '') {
        setError((prevError) => ({
          ...prevError,
          tipoDocente: 'Seleccione un nivel',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, tipoDocente: '' }));
      return true;
    },
    nombre: () => {
      if (form.persona?.nombre === undefined || form.persona?.nombre === '') {
        setError((prevError) => ({ ...prevError, nombre: 'Nombre invalido' }));
        return false;
      }
      setError((prevError) => ({ ...prevError, nombre: '' }));
      return true;
    },
    apellidoPaterno: () => {
      if (form.persona?.apellidoPaterno === undefined || form.persona?.apellidoPaterno === '') {
        setError((prevError) => ({
          ...prevError,
          apellidoPaterno: 'Apellido paterno invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, apellidoPaterno: '' }));
      return true;
    },
    apellidoMaterno: () => {
      if (form.persona?.apellidoMaterno === undefined || form.persona?.apellidoMaterno === '') {
        setError((prevError) => ({
          ...prevError,
          apellidoMaterno: 'Apellido materno invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, apellidoMaterno: '' }));
      return true;
    },
    nivelUltimoGrado: () => {
      if (form.nivelUltimoGrado === undefined || form.nivelUltimoGrado === '') {
        setError((prevError) => ({
          ...prevError,
          nivelUltimoGrado: 'Seleccione un Nivel',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, nivelUltimoGrado: '' }));
      return true;
    },
    nombreUltimoGrado: () => {
      if (
        form.nombreUltimoGrado === undefined
        || form.nombreUltimoGrado === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          nombreUltimoGrado: 'Nombre invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, nombreUltimoGrado: '' }));
      return true;
    },
    documentoPresentadoUltimoGrado: () => {
      if (
        form.documentoPresentadoUltimoGrado === undefined
        || form.documentoPresentadoUltimoGrado === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          documentoPresentadoUltimoGrado: 'Seleccione un documento',
        }));
        return false;
      }
      setError((prevError) => ({
        ...prevError,
        documentoPresentadoUltimoGrado: '',
      }));
      return true;
    },
    nivelPenultimoGrado: () => {
      if (
        form.nivelPenultimoGrado === undefined
        || form.nivelPenultimoGrado === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          nivelPenultimoGrado: 'Seleccione un Nivel',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, nivelPenultimoGrado: '' }));
      return true;
    },
    nombrePenultimoGrado: () => {
      if (
        form.nombrePenultimoGrado === undefined
        || form.nombrePenultimoGrado === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          nombrePenultimoGrado: 'Nombre invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, nombrePenultimoGrado: '' }));
      return true;
    },
    documentoPresentadoPenultimoGrado: () => {
      if (
        form.documentoPresentadoPenultimoGrado === undefined
        || form.documentoPresentadoPenultimoGrado === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          documentoPresentadoPenultimoGrado: 'Seleccione un documento',
        }));
        return false;
      }
      setError((prevError) => ({
        ...prevError,
        documentoPresentadoPenultimoGrado: '',
      }));
      return true;
    },
    asignaturasDocentes: () => {
      if (
        form.asignaturasDocentes === undefined
        || form.asignaturasDocentes.length === 0
      ) {
        setError((prevError) => ({
          ...prevError,
          asignaturasDocentes: 'Seleccione al menos una asignatura',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, asignaturasDocentes: '' }));
      return true;
    },
    tipoContratacion: () => {
      if (
        form.tipoContratacion === undefined
        || form.tipoContratacion === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          tipoContratacion: 'Seleccione un tipo de contratación',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, tipoContratacion: '' }));
      return true;
    },
    antiguedad: () => {
      if (form.antiguedad === undefined || form.antiguedad === '') {
        setError((prevError) => ({
          ...prevError,
          antiguedad: 'Nombre invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, antiguedad: '' }));
      return true;
    },
    totalHorasIndependiente: () => {
      if (
        form.totalHorasIndependiente === undefined
        || form.totalHorasIndependiente === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          totalHorasIndependiente: 'Nombre invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, totalHorasIndependiente: '' }));
      return true;
    },
    experienciaLaboral: () => {
      if (
        form.experienciaLaboral === undefined
        || form.experienciaLaboral === ''
      ) {
        setError((prevError) => ({
          ...prevError,
          experienciaLaboral: 'Nombre invalido',
        }));
        return false;
      }
      setError((prevError) => ({ ...prevError, experienciaLaboral: '' }));
      return true;
    },
  };

  return errors;
}
