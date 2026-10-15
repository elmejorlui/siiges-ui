import React, { useState, useEffect } from 'react';
import { Grid, Divider } from '@mui/material';
import {
  Select, getData, LabelData, useUI, useAuth,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

const ROLES_INSTITUCION_FIJA = ['representante', 'ce_ies', 'avances_sicyt'];

export default function ReporteForm({
  setInstitucion, setAlumnos, setPrograma, setLoading, setCicloEscolar, setPlantel,
}) {
  const { instituciones: fetchedInstituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const { setNoti } = useUI();
  const { session } = useAuth();
  const [instituciones, setInstituciones] = useState([]);
  const [ciclosEscolares, setCiclosEscolares] = useState([]);
  const [selectedCiclo, setSelectedCiclo] = useState('');
  const [labelPrograma, setLabelPrograma] = useState('');
  const [labelCicloEscolar, setLabelCicloEscolar] = useState('');

  const [selectedInstitucion, setSelectedInstitucion] = useState('');
  const [planteles, setPlanteles] = useState([]);
  const [selectedPlantel, setSelectedPlantel] = useState('');
  const [programas, setProgramas] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [totalExtraordinarios, setTotalExtraordinarios] = useState(4);

  const isAdminSicyt = session?.rol === 'ce_sicyt' || session?.rol === 'admin' || session?.rol === 'avances_sicyt';
  const isRepresentante = ROLES_INSTITUCION_FIJA.includes(session?.rol);

  useEffect(() => {
    if (fetchedInstituciones?.length) {
      const sortedInstituciones = [...fetchedInstituciones].sort(
        (a, b) => a.nombre.localeCompare(b.nombre),
      );
      setInstituciones(sortedInstituciones);
    }
  }, [fetchedInstituciones]);

  const fetchAlumnos = async (cicloEscolarId) => {
    try {
      const { data, statusCode } = await getData({
        endpoint: `/alumnos/ciclos/${cicloEscolarId}/extraordinarios`,
      });

      if (statusCode === 200 && Array.isArray(data)) {
        const transformedAlumnos = data.map((item) => ({
          id: item.id,
          matricula: item.alumno?.matricula || '',
          apellidoPaterno: item.alumno?.persona?.apellidoPaterno || '',
          apellidoMaterno: item.alumno?.persona?.apellidoMaterno || '',
          nombre: item.alumno?.persona?.nombre || '',
          grado: item.asignatura?.grado?.nombre || '',
          claveAsignatura: item.asignatura?.clave || '',
        }));
        setAlumnos(transformedAlumnos);
      } else {
        setAlumnos([]);
      }
    } catch (error) {
      setNoti({
        open: true,
        message: 'No se pudieron obtener los alumnos con extraordinarios.',
        type: 'error',
      });
      setAlumnos([]);
    }
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
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProgramas(sortedProgramas);
      }
    });
  };

  const fetchCiclosEscolares = async (programaId) => {
    const { data, statusCode } = await getData({
      endpoint: `/ciclosEscolares/programas/${programaId}`,
    });

    if (statusCode === 200) {
      const sortedCiclos = data
        .map((ciclo) => ({ id: ciclo.id, nombre: ciclo.nombre }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      setCiclosEscolares(sortedCiclos);
    } else {
      setNoti({
        open: true,
        message: '¡Error al obtener ciclos escolares!',
        type: 'error',
      });
      setCiclosEscolares([]);
    }
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
    const storedInstitucion = localStorage.getItem('reporte_selectedInstitucion');
    const storedPlantel = localStorage.getItem('reporte_selectedPlantel');
    const storedPrograma = localStorage.getItem('reporte_selectedPrograma');
    const storedCiclo = localStorage.getItem('reporte_selectedCiclo');

    if (storedInstitucion && !isRepresentante) {
      setSelectedInstitucion(storedInstitucion);
      setInstitucion(storedInstitucion);
      fetchPlanteles(storedInstitucion);
    }

    if (storedPlantel) {
      setSelectedPlantel(storedPlantel);
      fetchProgramas(storedPlantel);
    }

    if (storedPrograma) {
      setSelectedPrograma(storedPrograma);
      setPrograma(storedPrograma);
      fetchAlumnos(storedPrograma);
      fetchCiclosEscolares(storedPrograma);
    }

    if (storedCiclo) {
      setSelectedCiclo(storedCiclo);
    }
  }, []);

  const selectInstitucion = (institucionId) => {
    setSelectedInstitucion(institucionId);
    setInstitucion(institucionId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reporte_selectedInstitucion', institucionId);
    }
    setPlanteles([]);
    setProgramas([]);
    setAlumnos([]);
    fetchPlanteles(institucionId);
  };

  const handleInstitucionChange = (event) => {
    selectInstitucion(event.target.value);
  };

  // Auto-seleccionar institución cuando el rol es representante/ce_ies,
  // resolviendo el id vía getInstitucionIdFromSession (maneja el caso
  // ce_ies buscando primero al usuario padre).
  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId && institucionId !== selectedInstitucion) {
        selectInstitucion(institucionId);
      }
    };

    if (isRepresentante) {
      asignarInstitucionDesdeSesion();
    }
  }, [instituciones, session]);

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setSelectedPlantel(plantelId);
    setPlantel(plantelId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reporte_selectedPlantel', plantelId);
    }
    setProgramas([]);
    setAlumnos([]);
    fetchProgramas(plantelId);
  };

  const handleAlumnosExtra = async (cicloEscolarId) => {
    try {
      const { data, statusCode } = await getData({
        endpoint: `/alumnos/ciclos/${cicloEscolarId}/extraordinarios`,
      });

      if (statusCode === 200 && Array.isArray(data)) {
        setTotalExtraordinarios(data.length);
      } else {
        setTotalExtraordinarios(4);
      }
    } catch (error) {
      setTotalExtraordinarios(4);
      setNoti({
        open: true,
        message: 'No se pudo obtener el número de extraordinarios.',
        type: 'warning',
      });
    }
  };

  const handleCicloChange = (event) => {
    const cicloId = event.target.value;
    setSelectedCiclo(cicloId);
    setCicloEscolar(cicloId);

    const cicloObj = ciclosEscolares.find((c) => c.id === cicloId);
    setLabelCicloEscolar(cicloObj?.nombre || '');

    if (typeof window !== 'undefined') {
      localStorage.setItem('reporte_selectedCiclo', cicloId);
    }

    handleAlumnosExtra(cicloId);
    fetchAlumnos(cicloId);
  };

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);

    const programaObj = programas.find((p) => p.id === programaId);
    setLabelPrograma(programaObj?.nombre || '');

    if (typeof window !== 'undefined') {
      localStorage.setItem('reporte_selectedPrograma', programaId);
    }

    fetchAlumnos(programaId);
    fetchCiclosEscolares(programaId);
  };

  useEffect(() => {
    if (selectedCiclo && ciclosEscolares.length > 0) {
      const cicloObj = ciclosEscolares.find((c) => c.id === selectedCiclo);
      setLabelCicloEscolar(cicloObj?.nombre || '');
    }
  }, [selectedCiclo, ciclosEscolares]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Select
            title="Instituciones"
            name="instituciones"
            value={selectedInstitucion}
            options={instituciones || []}
            onChange={handleInstitucionChange}
            disabled={!isAdminSicyt}
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
        <Grid item xs={4}>
          <Select
            title="Ciclos Escolares"
            name="ciclosEscolares"
            value={selectedCiclo}
            options={ciclosEscolares}
            onChange={handleCicloChange}
            disabled={!selectedPrograma}
          />
        </Grid>
      </Grid>
      {labelPrograma && labelCicloEscolar && (
        <>
          <Divider sx={{ marginTop: 2 }} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <LabelData title="Programa" subtitle={labelPrograma} />
            </Grid>
            <Grid item xs={4}>
              <LabelData title="Ciclo Escolar" subtitle={labelCicloEscolar} />
            </Grid>
            <Grid item xs={4}>
              <LabelData title="Total de extraordinarios" subtitle={String(totalExtraordinarios)} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

ReporteForm.propTypes = {
  setAlumnos: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setInstitucion: PropTypes.func.isRequired,
  setCicloEscolar: PropTypes.func.isRequired,
  setPlantel: PropTypes.func.isRequired,
};
