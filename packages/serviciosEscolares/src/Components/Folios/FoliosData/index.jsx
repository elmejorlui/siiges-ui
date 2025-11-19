import Tooltip from '@mui/material/Tooltip';
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
  List,
  Divider,
} from '@mui/material';
import {
  ButtonSimple,
  Context,
  createRecord,
  DataTable,
  getData,
  GetFile,
  Input,
  InputFile,
  ListTitle,
  ListSubtitle,
  updateRecord,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import ButtonsFolios from '../ButtonsFolios';
import ModalCertificado from './Modal/certificados';
import ModalTitulo from './Modal/titulos';

const columnsTitulo = (handleEdit, handleConsult, status) => [
  {
    field: 'id',
    headerName: 'ID',
    hide: true,
  },
  { field: 'name', headerName: 'Nombre', width: 250 },
  { field: 'matricula', headerName: 'Matrícula', width: 250 },
  {
    field: 'fechaTerminacion',
    headerName: 'Terminación de plan de estudios',
    width: 250,
  },
  {
    field: 'fechaInicio',
    headerName: 'Inicio de Plan de Estudios',
    width: 250,
  },
  { field: 'fundamento', headerName: 'Fundamento S.S.', width: 250 },
  { field: 'folio', headerName: 'Folio', width: 250 },
  { field: 'foja', headerName: 'Foja', width: 250 },
  { field: 'libro', headerName: 'Libro', width: 250 },
  { field: 'titulacion', headerName: 'Titulacion', width: 250 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <div>
        <Tooltip title="Consultar" placement="top">
          <IconButton onClick={() => handleConsult(params.row.id)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
        {status !== 'consult' && (
          <Tooltip title="Editar" placement="top">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
];

const columnsCertificado = (handleEdit, handleConsult, status) => [
  {
    field: 'id',
    headerName: 'ID',
    hide: true,
  },
  { field: 'name', headerName: 'Nombre', width: 250 },
  { field: 'matricula', headerName: 'Matrícula', width: 250 },
  {
    field: 'fechaTerminacion',
    headerName: 'Fecha de Terminación',
    width: 250,
  },
  {
    field: 'fechaElaboracion',
    headerName: 'Fecha de Elaboración',
    width: 250,
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <div>
        <Tooltip title="Consultar" placement="top">
          <IconButton onClick={() => handleConsult(params.row.id)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
        {status !== 'consult' && (
          <Tooltip title="Editar" placement="top">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
];

const fundamentoLegal = [
  { id: 1, nombre: 'ART. 52 LRART. 5 CONST' },
  { id: 2, nombre: 'ART. 55 LRART. 5 CONST' },
  { id: 3, nombre: 'ART. 91 LRART. 5 CONST' },
  {
    id: 4,
    nombre:
      'ART. 10 REGLAMENTO PARA LA PRESTACIÓN DEL SERVICIO SOCIAL DE LOS ESTUDIANTES DE LAS INSTITUCIONES DE EDUCACIÓN SUPERIOR EN LA REPÚBLICA MEXICANA',
  },
  { id: 5, nombre: 'NO APLICA' },
];

const modalidadTitulacion = [
  { id: 1, nombre: 'Por Tesis' },
  { id: 2, nombre: 'Por Promedio' },
  { id: 3, nombre: 'Por Estudios de Posgrados' },
  { id: 4, nombre: 'Por Experiencia Laboral' },
  { id: 5, nombre: 'Por Ceneval' },
  { id: 6, nombre: 'Otro' },
];

const PERIODOS = {
  1: 'Semestral',
  2: 'Cuatrimestral',
  3: 'Anual',
  4: 'Semestral curriculum flexible',
  5: 'Cuatrimestral curriculum flexible',
};

const MODALIDADES = {
  1: 'Escolarizada',
  2: 'No Escolarizada',
  3: 'Mixta',
  4: 'Dual',
};

const NIVEL = {
  1: 'Bachillerato',
  2: 'Licenciatura',
  3: 'Técnico Superior Universitario',
  4: 'Especialidad',
  5: 'Maestría ',
  6: 'Doctorado',
  7: 'Profesional Asociado',
  8: 'Educación Continua',
};

export default function FoliosData({ type }) {
  const { setNoti, loading, setLoading } = useContext(Context);
  const [url, setUrl] = useState(null);
  const [id, setId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [rowData, setRowData] = useState({});
  const [alumnoType, setAlumnoType] = useState('create');
  const [alumnosData, setAlumnosData] = useState({});
  const [alumnoResponse, setAlumnoResponse] = useState(true);
  const [formData, setFormData] = useState({
    folioPago: '',
    tipoDocumentoId: '',
    tipoSolicitudFolioId: '',
    estatusSolicitudFolioId: 1,
    programaId: '',
    fecha: dayjs(),
  });
  const [etiquetas, setEtiquetas] = useState({
    tipoDocumento: '',
    tipoSolicitudFolio: '',
    acuerdoRvoe: '',
    planEstudios: '',
    gradoAcademico: '',
    modalidades: '',
    periodos: '',
  });

  const router = useRouter();
  const {
    tipoDocumento,
    tipoSolicitud,
    programa,
    id: editId,
    status,
  } = router.query;

  const tipoSolicitudFolioOptions = [
    { id: 1, label: 'Total' },
    { id: 2, label: 'Parcial' },
    { id: 3, label: 'Duplicado' },
  ];

  const selectedTipoSolicitudFolio = tipoSolicitudFolioOptions.find(
    (option) => option.id === Number(tipoSolicitud),
  )?.label || 'Desconocido';

  useEffect(() => {
    if (type === 'edit') {
      setIsSaved(true);
    }
  }, [type]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (type === 'edit' && editId) {
          response = await getData({
            endpoint: `/solicitudesFolios/${editId}`,
          });
        } else {
          response = await getData({ endpoint: `/programas/${programa}` });
        }
        const { data } = response;

        if (type === 'edit') {
          setFormData({
            folioPago: data.folioPago,
            tipoDocumentoId: data.tipoDocumentoId,
            tipoSolicitudFolioId: data.tipoSolicitudFolioId,
            estatusSolicitudFolioId: data.estatusSolicitudFolioId,
            programaId: data.programaId,
            fecha: dayjs(data.fecha),
          });
          setEtiquetas({
            tipoDocumento: data.tipoDocumento.nombre,
            tipoSolicitudFolio: data.tipoSolicitudFolio.nombre,
            acuerdoRvoe: data.programa.acuerdoRvoe,
            planEstudios: data.programa.nombre,
            gradoAcademico: data.programa.nivelId,
            institucion: data.programa?.plantel?.institucion?.nombre,
            claveCentroTrabajo: data.programa?.plantel?.claveCentroTrabajo,
            modalidades: data.programa?.modalidadId,
            periodos: data.programa?.cicloId,
          });
          setIsSaved(true);
          setId(editId);
          GetFile(
            {
              entidadId: editId,
              tipoEntidad: 'SOLICITUD_FOLIO',
              tipoDocumento: 'COMPROBANTE_PAGO_FOLIOS',
            },
            setUrl,
          );
        } else {
          setFormData({
            tipoDocumentoId: tipoDocumento,
            tipoSolicitudFolioId: tipoSolicitud,
            estatusSolicitudFolioId: 1,
            programaId: data.id,
            fecha: dayjs(data.fecha),
          });
          setEtiquetas({
            institucion: data.plantel?.institucion?.nombre,
            claveCentroTrabajo: data.plantel?.claveCentroTrabajo,
            tipoDocumento: tipoDocumento === '1' ? 'Titulo' : 'Certificado',
            tipoSolicitudFolio: selectedTipoSolicitudFolio,
            acuerdoRvoe: data.acuerdoRvoe,
            planEstudios: data.nombre,
            gradoAcademico: data.nivelId,
            modalidades: data.modalidadId,
            periodos: data.cicloId,
          });
        }
      } catch (error) {
        setNoti({
          open: true,
          message: `¡Error al cargar la solicitud!: ${error.message}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, editId]);

  useEffect(() => {
    if (id && alumnoResponse) {
      setLoading(true);
      getData({ endpoint: `/solicitudesFolios/${id}/alumnos` })
        .then((response) => {
          if (response.data) {
            const mappedRows = response.data.map((alumnos) => {
              const fundamentoObj = fundamentoLegal.find(
                (f) => f.id === alumnos.fundamentoServicioSocialId,
              );

              const titulacionObj = modalidadTitulacion.find(
                (t) => t.id === alumnos.modalidadTitulacionId,
              );

              return {
                id: alumnos.id,
                name: `${alumnos.alumno.persona.nombre} ${alumnos.alumno.persona.apellidoPaterno} ${alumnos.alumno.persona.apellidoMaterno}`,
                matricula: alumnos.alumno.matricula,
                fechaTerminacion: dayjs(alumnos.fechaTerminacion).format(
                  'DD/MM/YYYY',
                ),
                fechaElaboracion: dayjs(alumnos.fechaElaboracion).format(
                  'DD/MM/YYYY',
                ),
                fechaInicio: dayjs(alumnos.fechaInicio).format('DD/MM/YYYY'),
                fundamento: fundamentoObj
                  ? fundamentoObj.nombre
                  : 'Desconocido',
                folio: alumnos.folioDocumentoAlumno?.folioDocumento,
                foja: alumnos.folioDocumentoAlumno?.foja?.nombre,
                libro: alumnos.folioDocumentoAlumno?.libro?.nombre,
                titulacion: titulacionObj
                  ? titulacionObj.nombre
                  : 'Desconocido',
              };
            });

            setRows(mappedRows);
            setAlumnosData(response.data);
            setAlumnoResponse(false);
          }
        })
        .catch((error) => {
          setNoti({
            open: true,
            message: `¡Ocurrió un error inesperado!: ${error}`,
            type: 'error',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, alumnoResponse]);

  const handleEdit = async (value) => {
    try {
      setAlumnoType('edit');
      const alumno = alumnosData.find((row) => row.id === value);
      setRowData(alumno);
      setDisabled(false);
      setOpen(true);
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al cargar los datos!: ${error.message}`,
        type: 'error',
      });
    }
  };

  const handleConsult = async (value) => {
    try {
      setAlumnoType('consult');
      const alumno = alumnosData.find((row) => row.id === value);
      setRowData(alumno);
      setDisabled(true);
      setOpen(true);
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al cargar los datos!: ${error.message}`,
        type: 'error',
      });
    }
  };

  const handleAddAlumno = () => {
    setAlumnoType('create');
    setDisabled(false);
    setOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleConfirm = async (data = formData) => {
    if (loading) return;

    setLoading(true);
    try {
      const requestData = isSaved ? data : formData;

      const response = isSaved
        ? await updateRecord({
          data: requestData,
          endpoint: `/solicitudesFolios/${id}`,
        })
        : await createRecord({
          data: requestData,
          endpoint: '/solicitudesFolios',
        });

      if (response.statusCode === 200 || response.statusCode === 201) {
        setId(response.data.id);
        setIsSaved(true);
        setNoti({
          open: true,
          message:
            type === 'edit'
              ? '¡Éxito al actualizar la solicitud!'
              : '¡Éxito al crear la solicitud!, ya puede agregar alumnos',
          type: 'success',
        });
      } else {
        setNoti({
          open: true,
          message:
            response.message
            || '¡Error al procesar la solicitud, revise que los campos estén correctos!',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al procesar la solicitud!: ${error.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const updatedFormData = {
        ...formData,
        estatusSolicitudFolioId: 2,
      };

      await handleConfirm(updatedFormData);
      router.back();
      setOpen(false);
    } catch (error) {
      setOpen(false);
      setNoti({
        open: true,
        message: `¡Error al enviar la solicitud!: ${error}`,
        type: 'error',
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Datos de la Solicitud" />
          <Tab label="Alumnos" disabled={!id} />
        </Tabs>
      </Box>
      {tabIndex === 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Datos de la institución</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid container xs={6}>
                <Grid item xs>
                  <List>
                    <ListTitle text="Institucion" />
                    <ListTitle text="CCT" />
                    <ListTitle text="Acuerdo RVOE" />
                    <ListTitle text="Nivel" />
                    <ListTitle text="Nombre del Programa" />
                  </List>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
                <Grid item xs>
                  <List>
                    <ListSubtitle text={etiquetas.institucion || 'N/A'} />
                    <ListSubtitle text={etiquetas.claveCentroTrabajo || 'N/A'} />
                    <ListSubtitle text={etiquetas.acuerdoRvoe || 'N/A'} />
                    <ListSubtitle text={NIVEL[etiquetas.gradoAcademico] || 'N/A'} />
                    <ListSubtitle text={etiquetas.planEstudios || 'N/A'} />
                  </List>
                </Grid>
              </Grid>
              <Grid container xs={5}>
                <Grid item xs>
                  <List>
                    <ListTitle text="Modalidad" />
                    <ListTitle text="Periodo" />
                    <ListTitle text="Tipo de Documento" />
                    <ListTitle text="Tipo de Solicitud" />
                  </List>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
                <Grid item xs>
                  <List>
                    <ListSubtitle text={MODALIDADES[etiquetas.modalidades] || 'N/A'} />
                    <ListSubtitle text={PERIODOS[etiquetas.periodos] || 'N/A'} />
                    <ListSubtitle text={etiquetas.tipoDocumento || 'N/A'} />
                    <ListSubtitle text={etiquetas.tipoSolicitudFolio || 'N/A'} />
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Input
              label="Número de recibo de pago oficial"
              id="folioPago"
              name="folioPago"
              value={formData.folioPago}
              onChange={handleChange}
              disabled={status === 'consult'}
            />
          </Grid>
          <Grid item xs={12}>
            <InputFile
              label="Recibo de Pago"
              id={id}
              tipoDocumento="COMPROBANTE_PAGO_FOLIOS"
              tipoEntidad="SOLICITUD_FOLIO"
              url={url}
              setUrl={setUrl}
              disabled={!isSaved || status === 'consult'}
            />
          </Grid>
        </Grid>
      )}
      {tabIndex === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              buttonAdd={status !== 'consult'}
              buttonClick={handleAddAlumno}
              buttonText="Agregar Alumnos"
              title="Alumnos"
              rows={rows}
              columns={
                tipoDocumento === '1'
                  ? columnsTitulo(handleEdit, handleConsult, status)
                  : columnsCertificado(handleEdit, handleConsult, status)
              }
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          {formData.estatusSolicitudFolioId === 2 ? (
            <ButtonSimple
              design="error"
              text="Regresar"
              onClick={() => router.back()}
            />
          ) : (
            <ButtonsFolios
              save={handleConfirm}
              cancel={() => router.push('/serviciosEscolares/solicitudesFolios')}
              send={handleSend}
              disabled={status === 'consult'}
              saved={isSaved}
            />
          )}
        </Grid>
      </Grid>
      {tipoDocumento === '1' ? (
        <ModalTitulo
          open={open}
          setOpen={setOpen}
          type={alumnoType}
          id={id}
          rowData={rowData}
          programaId={formData.programaId}
          setAlumnoResponse={setAlumnoResponse}
          disabled={disabled}
        />
      ) : (
        <ModalCertificado
          open={open}
          setOpen={setOpen}
          type={alumnoType}
          id={id}
          programaId={formData.programaId}
          rowData={rowData}
          setAlumnoResponse={setAlumnoResponse}
          disabled={disabled}
        />
      )}
    </Box>
  );
}

FoliosData.defaultProps = {
  type: null,
};

FoliosData.propTypes = {
  type: PropTypes.string,
};
