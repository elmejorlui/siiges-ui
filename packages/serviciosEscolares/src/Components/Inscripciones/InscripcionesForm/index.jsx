import React, { useState, useEffect } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import {
  LabelData, Select, SelectAdd, getTurnoById, useAuth, useUI,
} from '@siiges-ui/shared';
import {
  getCiclosEscolares,
  getGrados,
  getGrupos,
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getAsignaturas from '@siiges-ui/instituciones/src/utils/getAsignaturas';
import CicloEscolarModal from './Modals/CicloEscolarModal';
import GruposModal from '../../utils/GruposModal';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

const LOCAL_STORAGE_KEY = 'inscripcionFormState';

export default function InscripcionForm({
  setAsignaturas,
  setProgramaId,
  setGrupoId,
  setLoading,
  setCicloTxt,
}) {
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const { setNoti } = useUI();
  const { session } = useAuth();

  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);
  const [openGrupos, setOpenGrupos] = useState(false);

  const initialState = typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    : {
      selectedInstitucion: '',
      selectedPlantel: '',
      selectedPrograma: '',
      selectedCicloEscolar: '',
      selectedGrado: '',
      selectedGrupo: '',
      labelPrograma: '',
      labelGrado: '',
      labelGrupo: '',
      labelTurno: '',
      labelCicloEscolar: '',
    };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const [arrays, setArrays] = useState({
    planteles: [],
    programas: [],
    ciclosEscolares: [],
    grados: [],
    grupos: [],
  });

  const [fetchGruposTrigger, setFetchGruposTrigger] = useState(false);

  const fetchPlanteles = (institucionId) => {
    getPlantelesByInstitucion(institucionId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron planteles!',
          type: 'warning',
        });
        setArrays((prevState) => ({ ...prevState, planteles: [] }));
      } else {
        const sortedPlanteles = data.planteles
          .map((plantel) => ({
            id: plantel.id,
            nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior} | CCT: ${plantel.claveCentroTrabajo}`,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setArrays((prevState) => ({ ...prevState, planteles: sortedPlanteles }));
      }
    });
  };

  const fetchProgramas = (plantelId) => {
    getProgramas(plantelId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron programas!',
          type: 'warning',
        });
        setArrays((prevState) => ({ ...prevState, programas: [] }));
      } else {
        const sortedProgramas = data.programas
          .map((programa) => ({
            id: programa.id,
            nombre: `${programa.nombre} ${programa.acuerdoRvoe}`,
            turno: programa.turno,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setArrays((prevState) => ({ ...prevState, programas: sortedProgramas }));
      }
    });
  };

  const fetchCiclosEscolares = (programaId) => {
    getCiclosEscolares(programaId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron ciclos escolares!',
          type: 'warning',
        });
        setArrays((prevState) => ({ ...prevState, ciclosEscolares: [] }));
      } else {
        const ciclosSorted = data.ciclosEscolares
          .slice()
          .sort((a, b) => {
            if (a.nombre === 'EQUIV') return 1;
            if (b.nombre === 'EQUIV') return -1;
            return a.nombre.localeCompare(b.nombre);
          });

        setArrays((prevState) => ({ ...prevState, ciclosEscolares: ciclosSorted }));
      }
    });
  };

  const fetchGrados = () => {
    getGrados(state.selectedPrograma, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron grados!',
          type: 'warning',
        });
        setArrays((prevState) => ({ ...prevState, grados: [] }));
      } else {
        const filteredGrados = data.grados.filter((grado) => {
          const nombre = grado.nombre.toLowerCase();
          return nombre !== 'optativa' && nombre !== 'optativas';
        });
        setArrays((prevState) => ({ ...prevState, grados: filteredGrados }));
      }
    });
  };

  const fetchGrupos = (gradoId) => {
    getGrupos(gradoId, state.selectedCicloEscolar, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron grupos!',
          type: 'warning',
        });
        setArrays((prevState) => ({ ...prevState, grupos: [] }));
      } else {
        const transformedGrupos = data.grupos.map((grupo) => ({
          id: grupo.id,
          nombre: grupo.descripcion,
          turnoId: grupo.turnoId,
        }));
        setArrays((prevState) => ({ ...prevState, grupos: transformedGrupos }));
      }
    });
  };

  const fetchAsignaturas = (gradoId) => {
    getAsignaturas(gradoId, state.selectedPrograma, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: '¡No se encontraron asignaturas!',
          type: 'warning',
        });
        setAsignaturas([]);
      } else {
        setAsignaturas(data.asignaturas);
      }
    });
  };

  const handleInstitucionChange = (institucionId) => {
    setState((prevState) => ({
      ...prevState,
      selectedInstitucion: institucionId,
    }));
    if (institucionId) fetchPlanteles(institucionId);
  };

  const handlePlantelChange = (plantelId) => {
    setState((prevState) => ({
      ...prevState,
      selectedPlantel: plantelId,
    }));
    if (plantelId) fetchProgramas(plantelId);
  };

  const handleProgramaChange = (programaId) => {
    const selectedProgramaObj = arrays.programas.find((programa) => programa.id === programaId);
    setState((prevState) => ({
      ...prevState,
      selectedPrograma: programaId,
      labelPrograma: selectedProgramaObj ? selectedProgramaObj.nombre : '',
    }));
    if (programaId) {
      fetchCiclosEscolares(programaId);
      setProgramaId(programaId);
    }
  };

  const handleCicloEscolarChange = (cicloEscolarId) => {
    const selectedCicloObj = arrays.ciclosEscolares.find((ciclo) => ciclo.id === cicloEscolarId);
    setState((prevState) => ({
      ...prevState,
      selectedCicloEscolar: cicloEscolarId,
      labelCicloEscolar: selectedCicloObj ? selectedCicloObj.nombre : '',
      selectedGrado: null,
      selectedGrupo: null,
    }));
    if (cicloEscolarId) fetchGrados();
  };

  const handleGradoChange = (gradoId) => {
    const selectedGradoObj = arrays.grados.find((grado) => grado.id === gradoId);
    setState((prevState) => ({
      ...prevState,
      selectedGrado: gradoId,
      labelGrado: selectedGradoObj ? selectedGradoObj.nombre : '',
      selectedGrupo: null,
    }));
    if (gradoId) {
      fetchGrupos(gradoId);
      fetchAsignaturas(gradoId);
    }
  };

  const handleGrupoChange = (grupoId) => {
    const selectedGrupoObj = arrays.grupos.find((grupo) => grupo.id === grupoId);
    const turno = getTurnoById(selectedGrupoObj.turnoId, 'nombre');
    setState((prevState) => ({
      ...prevState,
      selectedGrupo: grupoId,
      labelTurno: turno,
      labelGrupo: selectedGrupoObj ? selectedGrupoObj.nombre : '',
    }));
    setGrupoId(grupoId);
  };

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId) {
        handleInstitucionChange(institucionId);
      }
    };

    asignarInstitucionDesdeSesion();
  }, [instituciones, session]);

  useEffect(() => {
    if (fetchGruposTrigger) {
      fetchGrupos(state.selectedGrado);
      setFetchGruposTrigger(false);
    }
  }, [fetchGruposTrigger, state.selectedGrado]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state.selectedInstitucion) {
          await fetchPlanteles(state.selectedInstitucion);
        }
        if (state.selectedPlantel) {
          await fetchProgramas(state.selectedPlantel);
        }
        if (state.selectedPrograma) {
          await fetchCiclosEscolares(state.selectedPrograma);
          setProgramaId(state.selectedPrograma);
        }
        if (state.selectedCicloEscolar) {
          setCicloTxt(state.labelCicloEscolar);
          await fetchGrados();
        }
        if (state.selectedGrado) {
          await fetchGrupos(state.selectedGrado);
          await fetchAsignaturas(state.selectedGrado);
        }
        if (state.selectedGrupo) {
          setGrupoId(state.selectedGrupo);
        }
      } catch (error) {
        setNoti({
          open: true,
          message: `¡Error al cargar datos!: ${error.message}`,
          type: 'error',
        });
      }
    };

    fetchData();
    if (state.selectedGrupo === null) {
      setGrupoId(null);
    }
  }, [
    state.selectedInstitucion,
    state.selectedPlantel,
    state.selectedPrograma,
    state.selectedCicloEscolar,
    state.selectedGrado,
    state.selectedGrupo,
  ]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Select
            title="Instituciones"
            name="instituciones"
            value={state.selectedInstitucion}
            options={instituciones?.sort((a, b) => a.nombre.localeCompare(b.nombre)) || []}
            onChange={(event) => handleInstitucionChange(event.target.value)}
            disabled={isRepresentante}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Planteles"
            name="planteles"
            value={state.selectedPlantel}
            options={arrays.planteles || []}
            onChange={(event) => handlePlantelChange(event.target.value)}
            disabled={!state.selectedInstitucion}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Programas"
            name="programas"
            value={state.selectedPrograma}
            options={arrays.programas || []}
            onChange={(event) => handleProgramaChange(event.target.value)}
            disabled={!state.selectedPlantel}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Ciclos Escolares"
            name="ciclosEscolares"
            value={state.selectedCicloEscolar}
            options={arrays.ciclosEscolares || []}
            onChange={(event) => handleCicloEscolarChange(event.target.value)}
            disabled={!state.selectedPrograma}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            title="Grados"
            name="grados"
            value={state.selectedGrado}
            options={arrays.grados || []}
            onChange={(event) => handleGradoChange(event.target.value)}
            disabled={!state.selectedCicloEscolar}
          />
        </Grid>
        <Grid item xs={4}>
          <SelectAdd
            title="Grupos"
            name="Grupos"
            value={state.selectedGrupo}
            options={arrays.grupos || []}
            onChange={(event) => handleGrupoChange(event.target.value)}
            disabled={!state.selectedGrado}
            onAddClick={() => {
              setOpenGrupos(true);
            }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 2 }} />
      {state.selectedGrupo && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle">{state.labelPrograma}</Typography>
          </Grid>
          <Grid item xs={3}>
            <LabelData title="Grado" subtitle={state.labelGrado} />
          </Grid>
          <Grid item xs={3}>
            <LabelData title="Grupo" subtitle={state.labelGrupo} />
          </Grid>
          <Grid item xs={3}>
            <LabelData title="Turno" subtitle={state.labelTurno} />
          </Grid>
          <Grid item xs={3}>
            <LabelData title="Ciclo" subtitle={state.labelCicloEscolar} />
          </Grid>
        </Grid>
      )}
      <GruposModal
        open={openGrupos}
        setOpen={setOpenGrupos}
        type="new"
        params={{
          cicloEscolarId: state.selectedCicloEscolar,
          cicloNombre: arrays.ciclosEscolares.find(
            (ciclo) => ciclo.id === state.selectedCicloEscolar,
          )?.nombre,
          gradoId: state.selectedGrado,
          gradoNombre: arrays.grados.find((grado) => grado.id === state.selectedGrado)?.nombre,
        }}
        setFetchGrupos={setFetchGruposTrigger}
      />
    </>
  );
}

InscripcionForm.propTypes = {
  setAsignaturas: PropTypes.func.isRequired,
  setProgramaId: PropTypes.func.isRequired,
  setGrupoId: PropTypes.func.isRequired,
  setCicloTxt: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
