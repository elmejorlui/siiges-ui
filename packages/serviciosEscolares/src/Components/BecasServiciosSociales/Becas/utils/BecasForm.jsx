import { Grid } from '@mui/material';
import { getInstitucionesOpciones } from '@siiges-ui/instituciones';
import { Select, useAuth, useUI } from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function BecasForm({ setBecas, setInstitucion }) {
  const { session } = useAuth();
  const { setNoti, setLoading } = useUI();

  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('becasFormState');
      return savedState
        ? JSON.parse(savedState)
        : {
          selectedInstitucion: '',
          selectedPlanEstudios: '',
          selectedRvoe: '',
          selectedCiclo: '',
        };
    }
    return {
      selectedInstitucion: '',
      selectedPlanEstudios: '',
      selectedRvoe: '',
      selectedCiclo: '',
    };
  });

  const [arrays, setArrays] = useState({
    planEstudios: [],
    rvoes: [],
    ciclos: [],
  });
  const isAdmin = session.rol === 'admin' || session.rol === 'ce_sicyt';
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  useEffect(() => {
    if (!isAdmin && instituciones?.length) {
      const findIndexIntitucion = instituciones.findIndex(
        ({ usuarioId }) => usuarioId === session.id,
      );
      if (findIndexIntitucion !== -1) {
        setState((prevState) => ({
          ...prevState,
          selectedInstitucion: instituciones[findIndexIntitucion]?.id,
        }));
      } else {
        setNoti({
          open: true,
          message: '¡No se encontró una institución con nombre autorizado asociada al usuario!',
          type: 'error',
        });
      }
    }
  }, [isAdmin, instituciones]);

  const persistState = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('becasFormState', JSON.stringify(state));
    }
  };

  const mockFetch = (data, delay = 500) => new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });

  const fetchPlanEstudios = async () => {
    setLoading(true);
    try {
      const data = await mockFetch([
        { id: 'plan1', nombre: 'Plan de Estudios 1' },
        { id: 'plan2', nombre: 'Plan de Estudios 2' },
      ]);
      setArrays((prev) => ({ ...prev, planEstudios: data }));
    } catch (error) {
      setNoti({ severity: 'error', message: 'Error fetching Plan de Estudios' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRvoes = async () => {
    setLoading(true);
    try {
      const data = await mockFetch([
        { id: 'rvoe1', nombre: 'RVOE 1' },
        { id: 'rvoe2', nombre: 'RVOE 2' },
      ]);
      setArrays((prev) => ({ ...prev, rvoes: data }));
    } catch (error) {
      setNoti({ severity: 'error', message: 'Error fetching RVOEs' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCiclos = async () => {
    setLoading(true);
    try {
      const data = await mockFetch([
        { id: 'ciclo1', nombre: 'Ciclo 1' },
        { id: 'ciclo2', nombre: 'Ciclo 2' },
      ]);
      setArrays((prev) => ({ ...prev, ciclos: data }));
    } catch (error) {
      setNoti({ severity: 'error', message: 'Error fetching Ciclos' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBecas = async () => {
    setLoading(true);
    try {
      const data = await mockFetch([
        {
          id: 1,
          folio: 'LI2021306',
          fechaReporte: 'Negocios Digitales\nMIXTA',
          estatus: 'RVOE ENTREGADO',
          rvoe: 'ESLIXXXXX',
        },
        {
          id: 2,
          folio: 'LI2021307',
          fechaReporte: 'Ingeniería en Software\nPRESENCIAL',
          estatus: 'RVOE PENDIENTE',
          rvoe: 'ESLIYYYYY',
        },
      ]);
      setBecas(data);
    } catch (error) {
      setNoti({ severity: 'error', message: 'Error fetching Becas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    persistState();
  }, [state]);

  useEffect(() => {
    if (state.selectedInstitucion) {
      fetchPlanEstudios();
    } else {
      setArrays((prev) => ({ ...prev, planEstudios: [] }));
    }
  }, [state.selectedInstitucion]);

  useEffect(() => {
    if (state.selectedPlanEstudios) {
      fetchRvoes();
    } else {
      setArrays((prev) => ({ ...prev, rvoes: [] }));
    }
  }, [state.selectedPlanEstudios]);

  useEffect(() => {
    if (state.selectedRvoe) {
      fetchCiclos();
    } else {
      setArrays((prev) => ({ ...prev, ciclos: [] }));
    }
  }, [state.selectedRvoe]);

  useEffect(() => {
    if (state.selectedCiclo) {
      fetchBecas();
      setInstitucion(state);
    }
  }, [state.selectedCiclo]);

  const handleInstitucionChange = (event) => {
    const selectedInstitucion = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedInstitucion,
      selectedPlanEstudios: '',
      selectedRvoe: '',
      selectedCiclo: '',
    }));
  };

  const handlePlanEstudiosChange = (event) => {
    const selectedPlanEstudios = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedPlanEstudios,
      selectedRvoe: '',
      selectedCiclo: '',
    }));
  };

  const handleRvoeChange = (event) => {
    const selectedRvoe = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedRvoe,
      selectedCiclo: '',
    }));
  };

  const handleCicloChange = (event) => {
    const selectedCiclo = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedCiclo,
    }));
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={state.selectedInstitucion}
          options={instituciones || []}
          onChange={handleInstitucionChange}
          disabled={!isAdmin}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Plan de Estudios"
          name="planEstudios"
          value={state.selectedPlanEstudios}
          options={arrays.planEstudios || []}
          onChange={handlePlanEstudiosChange}
          disabled={!isAdmin && !state.selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="RVOE"
          name="rvoe"
          value={state.selectedRvoe}
          options={arrays.rvoes || []}
          onChange={handleRvoeChange}
          disabled={!isAdmin && !state.selectedPlanEstudios}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de Ciclo"
          name="ciclo"
          value={state.selectedCiclo}
          options={arrays.ciclos || []}
          onChange={handleCicloChange}
          disabled={!isAdmin && !state.selectedRvoe}
        />
      </Grid>
    </Grid>
  );
}

BecasForm.propTypes = {
  setBecas: PropTypes.func.isRequired,
  setInstitucion: PropTypes.func.isRequired,
};
