import React, { useContext, useState } from 'react';
import {
  ButtonLogin,
  Context,
  Input,
  InputPassword,
  LinkButton,
} from '@siiges-ui/shared';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const { setLoading, setNoti } = useContext(Context);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    usuario: '',
    correo: '',
    contrasena: '',
    recontrasena: '',
  });

  const [errors, setErrors] = useState({
    usuario: '',
    correo: '',
    contrasena: '',
    recontrasena: '',
  });

  const domain = process.env.NEXT_PUBLIC_URL;
  const apikey = process.env.NEXT_PUBLIC_API_KEY;

  const correoPattern = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
  const contrasenaPattern = /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[@$!%*?&./#])[A-Za-z0-9@$!%*?&./#]{8,25}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.usuario) {
      newErrors.usuario = '¡El usuario es obligatorio!';
    } else if (
      formValues.usuario.length < 3
      || formValues.usuario.length > 25
    ) {
      newErrors.usuario = '¡El usuario debe tener entre 3 y 25 caracteres!';
    }

    if (!formValues.correo) {
      newErrors.correo = '¡El correo es obligatorio!';
    } else if (
      formValues.correo.length < 3
      || formValues.correo.length > 50
      || !correoPattern.test(formValues.correo)
    ) {
      newErrors.correo = '!Error, el correo debe ser válido y tener entre 3 y 50 caracteres!';
    }

    if (!formValues.contrasena) {
      newErrors.contrasena = '¡La contraseña es obligatoria!';
    } else if (!contrasenaPattern.test(formValues.contrasena)) {
      newErrors.contrasena = '¡La contraseña debe tener entre 8 y 25 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo especial!';
    }

    if (!formValues.recontrasena) {
      newErrors.recontrasena = '¡Repetir contraseña es obligatorio!';
    } else if (formValues.contrasena !== formValues.recontrasena) {
      newErrors.recontrasena = '¡Las contraseñas no coinciden!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${domain}/api/v1/public/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', api_key: apikey },
        body: JSON.stringify({
          usuario: formValues.usuario,
          correo: formValues.correo,
          contrasena: formValues.contrasena,
        }),
      });

      if (!response.ok) {
        throw new Error('¡Error en el registro!');
      }

      setNoti({
        open: true,
        type: 'success',
        message:
          '¡Su usuario se envío con éxito!, ahora se esta procesando, se le avisará cuando sea aprobado',
      });

      // Add a delay before redirecting
      setTimeout(() => {
        router.push('/autenticacion/login');
      }, 2000); // 2-second delay before redirecting to the login page
    } catch (error) {
      console.error('Error:', error);
      setNoti({
        open: true,
        type: 'error',
        message:
          '¡Ocurrió un error al procesar su usuario, revise que los campos estén correctos y vuelva a intentarlo más tarde!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          mt: 3,
          py: 3,
          px: 3,
          width: '320px',
        },
      }}
      justifyContent="center"
    >
      <Paper
        elevation={5}
        sx={{
          fontSize: 12,
          '&:hover': {
            boxShadow: '15',
          },
          backgroundColor: 'rgb(255, 255, 255, 0.75)',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: 'center', color: 'black' }}
        >
          Pre-registro
        </Typography>

        <form onSubmit={handleSubmit}>
          <Input
            label="Usuario"
            id="usuario"
            name="usuario"
            value={formValues.usuario}
            onChange={handleInputChange}
            size="normal"
            required
            errorMessage={errors.usuario}
          />
          <Input
            label="Correo"
            id="correo"
            name="correo"
            value={formValues.correo}
            onChange={handleInputChange}
            size="normal"
            required
            errorMessage={errors.correo}
          />
          <InputPassword
            label="Contraseña"
            id="contrasena"
            name="contrasena"
            type="contrasena"
            value={formValues.contrasena}
            onChange={handleInputChange}
            size="normal"
            required
            errorMessage={errors.contrasena}
          />
          <InputPassword
            label="Repetir contraseña"
            id="recontrasena"
            name="recontrasena"
            type="contrasena"
            value={formValues.recontrasena}
            onChange={handleInputChange}
            size="normal"
            required
            errorMessage={errors.recontrasena}
          />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ zIndex: 1, position: 'relative', mt: 2 }}
          >
            <Link href="/autenticacion/login">
              <LinkButton text="¿Tienes cuenta? Inicia sesión" />
            </Link>
          </Box>

          <ButtonLogin
            color="secondary"
            type="submit"
            text="Enviar"
            click={handleSubmit}
          />
        </form>
      </Paper>
    </Box>
  );
}
