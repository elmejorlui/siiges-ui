import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { Select, useAuth, useUI } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstituciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getAlumnosByPrograma from '@siiges-ui/instituciones/src/utils/getAlumnosByPrograma';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';
import {
  ESTATUS_SERVICIO_SOCIAL,
  getEstatusNombre,
} from '../servicioSocialUtils';

export default function ServicioSocialForm({
  setInstitucion, setAlumnos, setPrograma, setNivel, setLoading,
}) {
  const { instituciones: fetchedInstituciones } = getInstituciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const { session } = useAuth();
  const { setNoti } = useUI();
  const [instituciones, setInstituciones] = useState([]);

  const [selectedInstitucion, setSelectedInstitucion] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('servicio_social_selectedInstitucion')
    ? localStorage.getItem('servicio_social_selectedInstitucion')
    : ''));

  const [planteles, setPlanteles] = useState([]);
  const [selectedPlantel, setSelectedPlantel] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('servicio_social_selectedPlantel')
    ? localStorage.getItem('servicio_social_selectedPlantel')
    : ''));

  const [programas, setProgramas] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('servicio_social_selectedPrograma')
    ? localStorage.getItem('servicio_social_selectedPrograma')
    : ''));

  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);

  useEffect(() => {
    if (fetchedInstituciones?.length) {
      const sortedInstituciones = [...fetchedInstituciones].sort(
        (a, b) => a.nombre.localeCompare(b.nombre),
      );
      setInstituciones(sortedInstituciones);
    }
  }, [fetchedInstituciones]);

  const fetchAlumnos = (programaId) => {
    getAlumnosByPrograma(programaId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener alumnos!: ${error.message}`,
          type: 'error',
        });
        setAlumnos([]);
      } else {
        const transformedAlumnos = data.alumnos.map((alumno) => {
          const estatusServicioSocial = alumno.estatusServicioSocial
            ?? ESTATUS_SERVICIO_SOCIAL.PENDIENTE.id;
          return {
            id: alumno.id,
            matricula: alumno.matricula,
            apellidoPaterno: alumno.persona.apellidoPaterno,
            apellidoMaterno: alumno.persona.apellidoMaterno,
            nombre: alumno.persona.nombre,
            situacion: alumno.situacion.nombre,
            estatusServicioSocialId: estatusServicioSocial,
            servicioSocial: getEstatusNombre(estatusServicioSocial),
            observaciones: alumno.observacionesServicioSocial || null,
            documentosServicioSocial: {
              ARCHIVO_CARTA_ASIGNACION: alumno.archivoCartaAsignacionUbicacion || null,
              ARCHIVO_INFORME_FINAL: alumno.archivoInformeFinalUbicacion || null,
              ARCHIVO_CARTA_LIBERACION: alumno.archivoCartaLiberacionUbicacion || null,
            },
          };
        });
        setAlumnos(transformedAlumnos);
      }
    });
  };

  const fetchPlanteles = (institucionId) => {
    getPlantelesByInstitucion(institucionId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener planteles!: ${error.message}`,
          type: 'error',
        });
        setPlanteles([]);
      } else {
        const sortedPlanteles = data.planteles
          .map((plantel) => ({
            id: plantel.id,
            nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior} | CCT: ${plantel.claveCentroTrabajo}`,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setPlanteles(sortedPlanteles);
      }
    });
  };

  const fetchProgramas = (plantelId) => {
    getProgramas(plantelId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener programas!: ${error.message}`,
          type: 'error',
        });
        setProgramas([]);
      } else {
        const sortedProgramas = data.programas
          .map((programa) => ({
            id: programa.id,
            nombre: `${programa.nombre} ${programa.acuerdoRvoe}`,
            nivelId: programa.nivelId || programa.nivel?.id || null,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProgramas(sortedProgramas);
      }
    });
  };

  useEffect(() => {
    if (selectedInstitucion) {
      fetchPlanteles(selectedInstitucion);
    }
    if (selectedPlantel) {
      fetchProgramas(selectedPlantel);
    }
    if (selectedPrograma) {
      fetchAlumnos(selectedPrograma);
    }
  }, [selectedInstitucion, selectedPlantel, selectedPrograma]);

  useEffect(() => {
    if (selectedPrograma && programas.length) {
      const programaSeleccionado = programas.find(
        (programa) => programa.id === Number(selectedPrograma),
      );
      if (programaSeleccionado) {
        setNivel(programaSeleccionado.nivelId);
      }
    }
  }, [selectedPrograma, programas]);

  const handleInstitucionChange = (event) => {
    const institucionId = event.target.value;
    setSelectedInstitucion(institucionId);
    setInstitucion(institucionId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('servicio_social_selectedInstitucion', institucionId);
    }
    setSelectedPlantel('');
    setSelectedPrograma('');
    setNivel(null);
    localStorage.setItem('servicio_social_selectedPlantel', '');
    localStorage.setItem('servicio_social_selectedPrograma', '');
    setPlanteles([]);
    setProgramas([]);
    setAlumnos([]);
    fetchPlanteles(institucionId);
  };

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setSelectedPlantel(plantelId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('servicio_social_selectedPlantel', plantelId);
    }
    setSelectedPrograma('');
    setNivel(null);
    localStorage.setItem('servicio_social_selectedPrograma', '');
    setProgramas([]);
    setAlumnos([]);
    fetchProgramas(plantelId);
  };

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('servicio_social_selectedPrograma', programaId);
    }
    fetchAlumnos(programaId);
  };

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      if (!isRepresentante || !instituciones?.length) return;

      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId) {
        setSelectedInstitucion(institucionId);
        setInstitucion(institucionId);
        localStorage.setItem('servicio_social_selectedInstitucion', institucionId);
        fetchPlanteles(institucionId);
      }
    };

    asignarInstitucionDesdeSesion();
  }, [isRepresentante, instituciones]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={instituciones || []}
          onChange={handleInstitucionChange}
          disabled={isRepresentante}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Planteles"
          name="planteles"
          value={selectedPlantel}
          options={planteles || []}
          onChange={handlePlantelChange}
          disabled={!selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Programas"
          name="programas"
          value={selectedPrograma}
          options={programas || []}
          onChange={handleProgramaChange}
          disabled={!selectedPlantel}
        />
      </Grid>
    </Grid>
  );
}

ServicioSocialForm.propTypes = {
  setAlumnos: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setNivel: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setInstitucion: PropTypes.func.isRequired,
};
