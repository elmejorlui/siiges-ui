import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import {
  Select, getData, useUI, useAuth, ButtonSimple,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

export default function TitulosForm({
  setTitulos, setPrograma, setLoading, reloadFlag, modo, toggleModo,
}) {
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });
  const { setNoti } = useUI();
  const { session } = useAuth();

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

  const [especifico, setEspecifico] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    curp: '',
    numeroRvoe: '',
  });

  const formatFecha = (fechaStr) => {
    const date = new Date(fechaStr);
    if (Number.isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const mapTitulos = (data) => data.map((item) => ({
    id: item.id,
    folioControl: item.folioControl,
    nombreCompleto: `${item.nombre} ${item.primerApellido} ${item.segundoApellido}`,
    curp: item.curp,
    numeroRvoe: item.numeroRvoe,
    nombreCarrera: item.nombreCarrera,
    fechaExpedicion: formatFecha(item.fechaExpedicion),
  }));

  const fetchTitulosByQuery = async (query) => {
    try {
      const response = await getData({
        endpoint: '/titulosElectronicos',
        query,
      });

      if (response.statusCode === 200) {
        setTitulos(mapTitulos(response.data));
      } else {
        setTitulos([]);
        setNoti({
          open: true,
          message: 'No se encontraron títulos',
          type: 'warning',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `Error al obtener titulos: ${error}`,
        type: 'error',
      });
    }
  };

  const fetchTitulos = async (programaId) => {
    const programaSeleccionado = programas.find(
      (programa) => programa.id === Number(programaId),
    );

    if (!programaSeleccionado) {
      setNoti({
        open: true,
        message: 'Programa no encontrado',
        type: 'warning',
      });
      return;
    }

    const { rvoe } = programaSeleccionado;

    if (!rvoe) {
      setNoti({
        open: true,
        message: 'Este programa no tiene acuerdo RVOE',
        type: 'warning',
      });
      return;
    }

    await fetchTitulosByQuery(`?numeroRvoe=${rvoe}&institucionId=${selectedInstitucion}`);
  };

  const handleEspecificoChange = (field) => (event) => {
    setEspecifico((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const fetchTitulosEspecifico = async () => {
    if (!selectedInstitucion) {
      setNoti({
        open: true,
        message: 'Debe seleccionar una institución',
        type: 'warning',
      });
      return;
    }

    const {
      nombre, primerApellido, segundoApellido, curp, numeroRvoe,
    } = especifico;

    if (!nombre.trim() && !primerApellido.trim() && !segundoApellido.trim()
      && !curp.trim() && !numeroRvoe.trim()) {
      setNoti({
        open: true,
        message: 'Debe capturar al menos un criterio de búsqueda (Nombre, Apellidos, CURP o RVOE)',
        type: 'warning',
      });
      return;
    }

    const params = new URLSearchParams({ institucionId: selectedInstitucion });
    if (nombre.trim()) params.append('nombre', nombre.trim());
    if (primerApellido.trim()) params.append('primerApellido', primerApellido.trim());
    if (segundoApellido.trim()) params.append('segundoApellido', segundoApellido.trim());
    if (curp.trim()) params.append('curp', curp.trim());
    if (numeroRvoe.trim()) params.append('numeroRvoe', numeroRvoe.trim());

    await fetchTitulosByQuery(`?${params.toString()}`);
  };

  const handleEspecificoKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchTitulosEspecifico();
    }
  };

  const institucionesOrdenadas = instituciones?.slice().sort(
    (a, b) => a.nombre.localeCompare(b.nombre),
  )
    || [];

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      const institucionId = await getInstitucionIdFromSession({
        instituciones: institucionesOrdenadas,
        session,
      });

      if (institucionId) {
        setSelectedInstitucion(institucionId);
      }
    };

    asignarInstitucionDesdeSesion();
  }, [institucionesOrdenadas, session]);

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);
    if (programaId) {
      fetchTitulos(programaId);
    } else {
      setTitulos([]);
    }
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
        const transformedProgramas = data.programas
          .map((programa) => ({
            id: programa.id,
            nombre: `${programa.nombre} | ${programa.acuerdoRvoe}`,
            rvoe: programa.acuerdoRvoe,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setProgramas(transformedProgramas);
      }
    });
  };

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setSelectedPlantel(plantelId);
    if (plantelId) {
      fetchProgramas(plantelId);
    } else {
      setProgramas([]);
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
        const transformedPlanteles = data.planteles
          .map((plantel) => ({
            id: plantel.id,
            nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior} | CCT: ${plantel.claveCentroTrabajo}`,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setPlanteles(transformedPlanteles);
      }
    });
  };

  useEffect(() => {
    if (selectedInstitucion && modo === 'general') {
      fetchPlanteles(selectedInstitucion);
    } else if (!selectedInstitucion) {
      setPlanteles([]);
    }
  }, [selectedInstitucion, modo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alumnos_selectedInstitucion', selectedInstitucion);
      localStorage.setItem('alumnos_selectedPlantel', selectedPlantel);
      localStorage.setItem('alumnos_selectedPrograma', selectedPrograma);
    }
  }, [selectedInstitucion, selectedPlantel, selectedPrograma]);

  useEffect(() => {
    if (selectedPlantel && modo === 'general') {
      fetchProgramas(selectedPlantel);
    }
  }, [selectedPlantel, modo]);

  useEffect(() => {
    if (selectedPrograma && modo === 'general') {
      fetchTitulos(selectedPrograma);
      setPrograma(selectedPrograma);
    }
  }, [selectedPrograma, programas, modo]);

  useEffect(() => {
    if (modo === 'general' && selectedPrograma) {
      fetchTitulos(selectedPrograma);
    } else if (modo === 'especifico') {
      fetchTitulosEspecifico();
    }
  }, [reloadFlag]);

  useEffect(() => {
    setTitulos([]);
    setPrograma(undefined);
  }, [modo]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sx={{ mt: 2 }}>
        <ButtonSimple
          text={modo === 'general' ? 'Búsqueda Específica' : 'Búsqueda General'}
          onClick={toggleModo}
          design="buscar"
          icon={<SwapHorizIcon />}
        />
      </Grid>
      <Grid item xs={4} sx={modo === 'general' ? { mt: 0 } : { mt: 0.5 }}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={institucionesOrdenadas}
          onChange={(event) => setSelectedInstitucion(event.target.value)}
          disabled={isRepresentante}
        />
      </Grid>
      {modo === 'general' ? (
        <>
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
        </>
      ) : (
        <>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              label="Nombre"
              value={especifico.nombre}
              onChange={handleEspecificoChange('nombre')}
              onKeyDown={handleEspecificoKeyDown}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              label="Primer apellido"
              value={especifico.primerApellido}
              onChange={handleEspecificoChange('primerApellido')}
              onKeyDown={handleEspecificoKeyDown}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              label="Segundo apellido"
              value={especifico.segundoApellido}
              onChange={handleEspecificoChange('segundoApellido')}
              onKeyDown={handleEspecificoKeyDown}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              label="CURP"
              value={especifico.curp}
              onChange={handleEspecificoChange('curp')}
              onKeyDown={handleEspecificoKeyDown}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              label="RVOE"
              value={especifico.numeroRvoe}
              onChange={handleEspecificoChange('numeroRvoe')}
              onKeyDown={handleEspecificoKeyDown}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <ButtonSimple
              text="Buscar"
              onClick={fetchTitulosEspecifico}
              design="buscar"
              fullWidth
            >
              <SearchIcon />
            </ButtonSimple>
          </Grid>
        </>
      )}
    </Grid>
  );
}

TitulosForm.propTypes = {
  setTitulos: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  reloadFlag: PropTypes.func.isRequired,
  modo: PropTypes.oneOf(['general', 'especifico']).isRequired,
  toggleModo: PropTypes.func.isRequired,
};
