import React, { useContext, useState } from 'react';
import {
  ButtonLogin, Context, InputPassword, LinkButton,
} from '@siiges-ui/shared';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

export default function NewPassword() {
  const router = useRouter();
  const { token } = router.query;
  const { setNoti, setLoading, loading } = useContext(Context);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    repeatNewPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[@$!%*?&./#])[A-Za-z0-9@$!%*?&./#]{8,25}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (passwords.newPassword !== passwords.repeatNewPassword) {
      setNoti({
        open: true,
        message: '¡Las contraseñas no coinciden!',
        type: 'error',
      });
      return;
    }

    if (!validatePassword(passwords.newPassword)) {
      setNoti({
        open: true,
        message: '¡La contraseña debe tener entre 8 y 25 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo especial!',
        type: 'error',
      });
      return;
    }

    if (!token) {
      setNoti({
        open: true,
        message: '¡El enlace de recuperación de contraseña ya caduco!',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${domain}/api/v1/public/auth/newPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey,
        },
        body: JSON.stringify({
          token,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNoti({
          open: true,
          message: '¡Contraseña cambiada exitosamente!',
          type: 'success',
        });

        router.push('/autenticacion/login');
      } else {
        setNoti({
          open: true,
          message: data.message || '¡Error al cambiar la contraseña!',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: '¡Error de conexión!. Por favor intenta nuevamente.',
        type: 'error',
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
          height: 'auto',
          minHeight: '260px',
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
        }}
      >
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>Recuperar contraseña</Typography>
        <InputPassword
          label="Nueva contraseña"
          id="newPassword"
          name="newPassword"
          auto="newPassword"
          size="normal"
          onChange={handleInputChange}
          type="password"
          value={passwords.newPassword}
        />
        <InputPassword
          label="Repita la Nueva contraseña"
          id="repeatNewPassword"
          name="repeatNewPassword"
          auto="repeatNewPassword"
          size="normal"
          onChange={handleInputChange}
          type="password"
          value={passwords.repeatNewPassword}
        />

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ zIndex: 1, position: 'relative', mt: 2 }}
        >
          <Link href="/autenticacion/login" passHref>
            <LinkButton text="¿Tienes cuenta? Inicia sesión" />
          </Link>
        </Box>
        <ButtonLogin
          color="secondary"
          type="submit"
          text="Cambiar contraseña"
          click={handleSubmit}
          disabled={loading}
        />
      </Paper>
    </Box>
  );
}
