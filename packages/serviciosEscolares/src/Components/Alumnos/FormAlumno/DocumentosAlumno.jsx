import { Grid, Typography } from '@mui/material';
import {
  ButtonSimple, Context, GetFile, InputFile,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

export default function DocumentosAlumno({ id, type }) {
  const { setNoti } = useContext(Context);
  const [fileURLs, setFileURLs] = useState([null, null, null]);
  const router = useRouter();

  const handleFileLoaded = (index, url) => {
    setFileURLs((prevURLs) => {
      const newURLs = [...prevURLs];
      newURLs[index] = url;
      return newURLs;
    });
  };

  useEffect(() => {
    if (type === 'edit' || type === 'view') {
      const fetchFiles = async () => {
        const fileTypes = ['ARCHIVO_CERTIFICADO', 'ARCHIVO_NACIMIENTO', 'ARCHIVO_CURP'];
        const promises = fileTypes.map((tipoDocumento, index) => new Promise((resolve) => {
          GetFile({ tipoEntidad: 'ALUMNO', entidadId: id, tipoDocumento }, (url, error) => {
            if (!error && url) {
              handleFileLoaded(index, url);
            }
            resolve();
          });
        }));

        await Promise.all(promises);
      };

      fetchFiles();
    }
  }, [id, type]);

  const saveButtonAction = async () => {
    setNoti({
      open: true,
      message: 'Documentos guardados con éxito',
      type: 'success',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {type === 'edit' && (
        <>
          <Typography variant="body1">
            ¡Nota importante! Los documentos que se adjunten deberán estar
            escaneados a color, con buena resolución y cuidando de que no se pierda
            u omita información.
          </Typography>
          <br />
        </>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_CERTIFICADO"
            id={id}
            label="Archivo de Cédula Profesional, Título o equivalente (PDF)"
            url={fileURLs[0]}
            setUrl={(url) => handleFileLoaded(0, url)}
            disabled={type === 'view'}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_NACIMIENTO"
            id={id}
            label="Archivo Acta de Nacimiento (PDF)"
            url={fileURLs[1]}
            setUrl={(url) => handleFileLoaded(1, url)}
            disabled={type === 'view'}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_CURP"
            id={id}
            label="Archivo CURP (PDF)"
            url={fileURLs[2]}
            setUrl={(url) => handleFileLoaded(2, url)}
            disabled={type === 'view'}
          />
        </Grid>

        {/* Botones solo en modo edición */}
        {type === 'edit' && (
          <>
            <Grid item xs={9} />
            <Grid item>
              <ButtonSimple
                text="Regresar"
                design="enviar"
                align="right"
                onClick={() => {
                  router.back();
                }}
              />
            </Grid>
            <Grid item>
              <ButtonSimple onClick={saveButtonAction} text="Guardar" />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}

DocumentosAlumno.defaultProps = {
  id: null,
  type: 'view',
};

DocumentosAlumno.propTypes = {
  id: PropTypes.number,
  type: PropTypes.oneOf(['view', 'edit']),
};
