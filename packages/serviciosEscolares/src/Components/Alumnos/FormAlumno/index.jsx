import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  Select,
  Input,
  Context,
  ButtonSimple,
  InputDate,
} from '@siiges-ui/shared';
import { useRouter } from 'next/router';
import {
  campos,
  setAndValidateFormData,
  mailValidator,
  curpValidator,
  generos,
  nacionalidad,
} from './dataAlumnos';
import alumnosService from '../../utils/alumnosService';
import SituacionSelect from '../../utils/SituacionSelect';

export default function FormAlumno({
  type,
  alumno,
  setId,
  onAlumnoUpdated,
}) {
  const router = useRouter();
  const { query } = router;
  const [form, setForm] = useState();
  const { session, setLoading, setNoti } = useContext(Context);
  const [formSelect, setFormSelect] = useState({
    situacionId: alumno?.situacionId || 2,
  });
  const [errorMail, setErrorMail] = useState('');
  const [errorCurp, setErrorCurp] = useState('');
  const ifRepresentantes = (session.rol === 'representante' || session.rol === 'ce_ies');

  const getErrorMessage = (campoId) => {
    if (campoId === 'correoPrimario') return errorMail;
    if (campoId === 'curp') return errorCurp;
    return false;
  };

  const findId = (param, search) => {
    const Obj = param.find((n) => n.nombre === alumno?.[search]);
    return Obj ? Obj.id : '';
  };

  useEffect(() => {
    if (alumno) {
      setFormSelect((prevForm) => ({
        ...prevForm,
        sexo: findId(generos, 'sexo'),
        nacionalidad: findId(nacionalidad, 'nacionalidad'),
        situacionId: alumno.situacionId || '',
      }));
    }
    if (ifRepresentantes) {
      setForm((prevForm) => ({
        ...prevForm,
      }));
    }
  }, [alumno, session.rol]);

  const validator = (name, value) => {
    if (name === 'correoPrimario') {
      if (mailValidator(value)) {
        setErrorMail('');
        return true;
      }
      setErrorMail('¡El campo Correo no es válido!.');
      return false;
    }

    if (name === 'curp') {
      if (curpValidator(value)) {
        setErrorCurp('');
        return true;
      }
      setErrorCurp('¡El CURP debe tener 18 caracteres!.');
      return false;
    }

    if (value === '' || value === undefined) {
      setNoti({
        open: true,
        message: `El campo ${name} es obligatorio.`,
        type: 'error',
      });
      return false;
    }

    return true;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const isValid = validator(name, value);
    if (isValid) {
      setForm({ ...form, [name]: value.toString().trim() });
      const field = campos.find((campo) => campo.id === name);
      if (field?.type === 'select') {
        setFormSelect({ ...formSelect, [name]: value });
      }
    }
  };

  const validateFormBeforeSubmit = () => {
    let isValid = true;
    campos.forEach((field) => {
      const value = form?.[field.id] || alumno?.[field.id];
      if (
        field.id !== 'apellidoMaterno'
        && field.type !== 'select'
        && (!value || value.trim() === '')
      ) {
        setNoti({
          open: true,
          message: `El campo ${field.label} es obligatorio.`,
          type: 'error',
        });
        isValid = false;
      }
    });
    return isValid;
  };

  const saveButtonAction = async () => {
    setLoading(true);
    if (!validateFormBeforeSubmit()) {
      setLoading(false);
      return;
    }

    try {
      const dataBody = setAndValidateFormData({ ...form, ...query }).formData;
      if (type === 'edit') {
        await alumnosService({
          id: query.alumnoId,
          dataBody,
          method: 'PATCH',
        });
        setNoti({
          open: true,
          message: '¡Alumno actualizado con éxito!',
          type: 'success',
        });
        if (onAlumnoUpdated) await onAlumnoUpdated();
      } else {
        const response = await alumnosService({ dataBody, method: 'POST' });
        setId(response.data.id);
        setNoti({
          open: true,
          message: '¡Alumno registrado con éxito!',
          type: 'success',
        });
      }
    } catch (err) {
      setNoti({
        open: true,
        message: `¡Error al registrar alumno! ${err.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCampo = (campo) => {
    const value = formSelect?.[campo.id] || '';
    const errorMessage = getErrorMessage(campo.id);

    if (campo.type === 'text') {
      return (
        <Input
          id={campo.id}
          label={campo.label}
          name={campo.id}
          auto={campo.id}
          onChange={handleOnChange}
          value={form?.[campo.id] || alumno?.[campo.id]}
          type="text"
          disabled={campo.disabled}
          errorMessage={errorMessage}
        />
      );
    }

    if (campo.type === 'date') {
      return (
        <InputDate
          id={campo.id}
          label={campo.label}
          name={campo.id}
          onChange={handleOnChange}
          value={form?.[campo.id] || alumno?.[campo.id]}
          disabled={campo.disabled}
          errorMessage={errorMessage}
          type="datetime"
        />
      );
    }

    if (campo.id === 'situacionId') {
      return (
        <SituacionSelect
          title={campo.label}
          options={campo.options}
          disabled={!(type === 'edit')}
          ifRepresentantes={ifRepresentantes}
          name={campo.id}
          value={value}
          onChange={handleOnChange}
          errorMessage={errorMessage}
        />
      );
    }

    return (
      <Select
        title={campo.label}
        options={campo.options}
        disabled={campo.disabled}
        name={campo.id}
        value={value}
        onChange={handleOnChange}
        errorMessage={errorMessage}
      />
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="body1">
        ¡Nota importante!. El nombre del alumno se debe registrar tal y como
        aparece en el acta de nacimiento, en mayúsculas y en caso de tener
        acentos, letra Ñ (poner N), diéresis o algún otro caracter especial, favor de omitirlos.
      </Typography>
      <br />
      <Grid container spacing={2}>
        {campos.map((campo) => (
          <Grid item xs={4} key={campo.id}>
            {renderCampo(campo)}
          </Grid>
        ))}

        {type === 'edit' && (
          <Grid item xs={4}>
            <InputDate
              id="fechaRegistro"
              label="Fecha de registro"
              name="fechaRegistro"
              autoComplete="fechaRegistro"
              onChange={handleOnChange}
              value={alumno?.fechaRegistro}
              type="datetime"
              disabled
            />
          </Grid>
        )}

        <Grid item xs={9} />
        <Grid item>
          <ButtonSimple
            design="enviar"
            onClick={() => { router.back(); }}
            text="Regresar"
          />
        </Grid>
        <Grid item>
          <ButtonSimple onClick={saveButtonAction} text="Guardar" />
        </Grid>
      </Grid>
    </div>
  );
}

FormAlumno.propTypes = {
  type: PropTypes.string.isRequired,
  setId: PropTypes.func,
  alumno: PropTypes.shape({
    id: PropTypes.number,
    fechaRegistro: PropTypes.string,
    situacionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    search: PropTypes.string,
  }),
  onAlumnoUpdated: PropTypes.func,
};

FormAlumno.defaultProps = {
  alumno: null,
  setId: null,
  onAlumnoUpdated: null,
};
