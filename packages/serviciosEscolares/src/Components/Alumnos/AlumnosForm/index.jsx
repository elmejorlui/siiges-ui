import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import { Grid } from '@mui/material';
import { Select, useAuth, useUI } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getAlumnosByPrograma from '@siiges-ui/instituciones/src/utils/getAlumnosByPrograma';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

export default function AlumnosForm({
  setAlumnos,
  setPrograma,
  setLoading,
  setPermisoAlumno,
}) {
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });
  const { session } = useAuth();
  const { setNoti } = useUI();

  const [selectedInstitucion, setSelectedInstitucion] = useState(() => (typeof window !== 'undefined'
    && localStorage.getItem('alumnos_selectedInstitucion')
    ? localStorage.getItem('alumnos_selectedInstitucion')
    : ''));

  const [selectedPlantel, setSelectedPlantel] = useState(() => (typeof window !== 'undefined'
    && localStorage.getItem('alumnos_selectedPlantel')
    ? localStorage.getItem('alumnos_selectedPlantel')
    : ''));

  const [selectedPrograma, setSelectedPrograma] = useState(() => (typeof window !== 'undefined'
    && localStorage.getItem('alumnos_selectedPrograma')
    ? localStorage.getItem('alumnos_selectedPrograma')
    : ''));

  const [planteles, setPlanteles] = useState([]);
  const [programas, setProgramas] = useState([]);
  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);

  const isMountInstitucion = useRef(true);
  const isMountPlantel = useRef(true);

  const handleFetchError = (error, setter, mensaje) => {
    setNoti({
      open: true,
      message: `${mensaje}: ${error.message}`,
      type: 'error',
    });
    setter([]);
  };

  const fetchAlumnos = (programaId) => {
    getAlumnosByPrograma(programaId, (error, data) => {
      if (error) {
        handleFetchError(error, setAlumnos, '¡Error al obtener alumnos!');
      } else {
        const transformedAlumnos = data.alumnos.map((alumno) => ({
          id: alumno.id,
          matricula: alumno.matricula,
          apellidoPaterno: alumno.persona.apellidoPaterno,
          apellidoMaterno: alumno.persona.apellidoMaterno,
          nombre: alumno.persona.nombre,
          situacion: alumno.situacion.nombre,
          validacion:
            alumno.validacion?.situacionValidacion?.nombre || 'Sin validar',
          archivoCertificadoUbicacion: alumno.archivoCertificadoUbicacion || null,
          archivoNacimientoUbicacion: alumno.archivoNacimientoUbicacion || null,
          archivoCurpUbicacion: alumno.archivoCurpUbicacion || null,
          archivoValidacionUbicacion: alumno.archivoValidacionUbicacion || null,
        }));
        setAlumnos(transformedAlumnos);
      }
    });
  };

  const fetchProgramas = (plantelId) => {
    getProgramas(plantelId, (error, data) => {
      if (error) {
        handleFetchError(error, setProgramas, '¡Error al obtener programas!');
      } else {
        const transformedProgramas = data.programas
          .map((programa) => ({
            id: String(programa.id),
            nombre: `${programa.nombre} ${programa.acuerdoRvoe}`,
            permisoAlumno: programa.permisoAlumno,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setProgramas(transformedProgramas);
      }
    });
  };

  const fetchPlanteles = (institucionId) => {
    getPlantelesByInstitucion(institucionId, (error, data) => {
      if (error) {
        handleFetchError(error, setPlanteles, '¡Error al obtener planteles!');
      } else {
        const transformedPlanteles = data.planteles
          .map((plantel) => ({
            id: String(plantel.id),
            nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior} | CCT: ${plantel.claveCentroTrabajo}`,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setPlanteles(transformedPlanteles);
      }
    });
  };

  const institucionesOrdenadas = useMemo(
    () => (
      instituciones
        ?.slice()
        .map((institucion) => ({ ...institucion, id: String(institucion.id) }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
      || []
    ),
    [instituciones],
  );

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      const institucionId = await getInstitucionIdFromSession({
        instituciones: institucionesOrdenadas,
        session,
      });

      if (institucionId) {
        setSelectedInstitucion(String(institucionId));
      }
    };

    asignarInstitucionDesdeSesion();
  }, [institucionesOrdenadas, session]);

  const handleInstitucionChange = (event) => {
    setSelectedInstitucion(event.target.value);
    setPrograma();
  };

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setSelectedPlantel(plantelId);
    setPrograma();
    if (!plantelId) {
      setProgramas([]);
    }
  };

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setSelectedPrograma(programaId);
    if (!programaId) {
      setAlumnos([]);
      setPermisoAlumno(false);
    }
  };

  useEffect(() => {
    if (isMountInstitucion.current) {
      isMountInstitucion.current = false;
      if (selectedInstitucion) {
        fetchPlanteles(selectedInstitucion);
      }
      return;
    }

    setSelectedPlantel('');
    setSelectedPrograma('');
    setPermisoAlumno(false);
    if (selectedInstitucion) {
      fetchPlanteles(selectedInstitucion);
    } else {
      setPlanteles([]);
    }
  }, [selectedInstitucion]);

  useEffect(() => {
    if (isMountPlantel.current) {
      isMountPlantel.current = false;
      if (selectedPlantel) {
        fetchProgramas(selectedPlantel);
      }
      return;
    }

    setSelectedPrograma('');
    setPermisoAlumno(false);
    if (selectedPlantel) {
      fetchProgramas(selectedPlantel);
    } else {
      setProgramas([]);
    }
  }, [selectedPlantel]);

  useEffect(() => {
    if (selectedPrograma) {
      const programaSeleccionado = programas.find(
        (p) => p.id === String(selectedPrograma),
      );

      setPrograma(selectedPrograma);
      setPermisoAlumno(programaSeleccionado?.permisoAlumno || false);
      fetchAlumnos(selectedPrograma);
    }
  }, [selectedPrograma, programas]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alumnos_selectedInstitucion', selectedInstitucion);
      localStorage.setItem('alumnos_selectedPlantel', selectedPlantel);
      localStorage.setItem('alumnos_selectedPrograma', selectedPrograma);
    }
  }, [selectedInstitucion, selectedPlantel, selectedPrograma]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={institucionesOrdenadas}
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

AlumnosForm.propTypes = {
  setAlumnos: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setPermisoAlumno: PropTypes.func.isRequired,
};
