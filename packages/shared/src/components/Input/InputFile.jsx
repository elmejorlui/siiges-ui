import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import '../../styles/Inputs/InputFile.css';
import {
  Button, ButtonGroup, Grid, Typography,
} from '@mui/material';
import { DropzoneDialog } from 'mui-file-dropzone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import fileToFormData from '../Submit/FileToFormData';
import SubmitDocument from '../Submit/SubmitDocument';
import { Context } from '../../utils/handlers/context';

export default function InputFile({
  label,
  id,
  tipoEntidad,
  tipoDocumento,
  url,
  setUrl,
  onChange,
  disabled,
  isUploaded,
  title,
  openDropzone,
  setFilesState,
}) {
  const [files, setFiles] = useState([]);
  const { setNoti } = useContext(Context);
  const [open, setOpen] = useState(false);
  const domain = process.env.NEXT_PUBLIC_URL;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      if (files.length === 0) {
        throw new Error('¡Algo salió mal, ingrese un documento!');
      }

      const formData = await fileToFormData(files[0]);
      formData.append('tipoEntidad', tipoEntidad);
      formData.append('entidadId', id);
      formData.append('tipoDocumento', tipoDocumento);

      await SubmitDocument(formData, setUrl);

      setNoti({
        open: true,
        message: '¡Documento cargado con éxito!',
        type: 'success',
      });
    } catch (error) {
      setNoti({
        open: true,
        message: error.message || '¡Algo salió mal, revise su documento!',
        type: 'error',
      });
    } finally {
      setOpen(false);
    }
  };

  const handleFileSave = async () => {
    if (setFilesState) {
      setFilesState((prev) => ({
        ...prev,
        [tipoDocumento]: files[0],
      }));
      setOpen(false);
    } else if (onChange) {
      onChange(files);
      setOpen(false);
    } else {
      await handleSave();
    }
  };

  const gridStyle = {
    border: '1px solid #0072ce',
    borderRadius: '3px',
    padding: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  useEffect(() => {
    if (openDropzone) {
      handleOpen();
    }
  }, [openDropzone]);

  return (
    <>
      <Grid container style={gridStyle}>
        <Grid item xs={6}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={3}>
          <ButtonGroup aria-label="text button group" style={buttonGroupStyle}>
            <Button onClick={handleOpen} disabled={disabled} variant="text">
              <AttachFileIcon />
            </Button>
            {isUploaded ? (
              <Button variant="text">
                <CheckCircleIcon color="success" />
              </Button>
            ) : (
              url && (
                <Link href={`${domain}${url}`} passHref legacyBehavior>
                  <Button
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                  >
                    <FileOpenIcon />
                  </Button>
                </Link>
              )
            )}
          </ButtonGroup>
        </Grid>
      </Grid>
      <DropzoneDialog
        open={open}
        dropzoneText={(
          <div style={{ textAlign: 'center' }}>
            <div>Arrastre un archivo aquí, o haga clic</div>
            <div style={{ fontSize: '1.2rem', marginTop: '8px', color: '#666' }}>
              Formatos aceptados: PDF (Max. 5MB)
            </div>
          </div>
        )}
        dialogTitle={title}
        submitButtonText="Aceptar"
        cancelButtonText="Cancelar"
        filesLimit={1}
        showPreviews
        onChange={(newFiles) => setFiles(newFiles)}
        onSave={handleFileSave}
        maxFileSize={5000000}
        onClose={handleClose}
      />
    </>
  );
}

InputFile.defaultProps = {
  url: '',
  setUrl: () => { },
  id: null,
  disabled: false,
  onChange: null,
  isUploaded: false,
  openDropzone: false,
  title: 'Subir archivo',
  setFilesState: null,
};

InputFile.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tipoDocumento: PropTypes.string.isRequired,
  tipoEntidad: PropTypes.string.isRequired,
  url: PropTypes.string,
  setUrl: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  isUploaded: PropTypes.bool,
  openDropzone: PropTypes.bool,
  title: PropTypes.string,
  setFilesState: PropTypes.func,
};
