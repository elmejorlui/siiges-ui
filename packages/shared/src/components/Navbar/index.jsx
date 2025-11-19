import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Link from 'next/link';
import LogoWhite from '../Images/LogoWhite';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/autenticacion/login">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <LogoWhite />
            </IconButton>
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              fontSize: '1rem',
            }}
          />
          {/* <Link href="/autenticacion/preRegistro">
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              sx={{
                backgroundColor: '#FF8300',
                textTransform: 'none',
                color: 'white',
                borderRadius: '2rem',
                '&:hover': {
                  background: '#FF9A33',
                  m: 'auto',
                },
              }}
            >
              Pre-registro
            </Button>
          </Link> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
