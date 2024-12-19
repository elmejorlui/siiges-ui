import React, {
  useState, useContext, useEffect, useCallback,
} from 'react';
import { Grid } from '@mui/material';
import { Select, Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstituciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';

const LOCAL_STORAGE_KEY = 'foliosFormState';

export default function FoliosForm({
  setTipoSolicitud,
  setTipoDocumento,
  setEstatus,
  setPrograma,
  setPlantel,
  setLoading,
}) {
  const { instituciones } = getInstituciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const { setNoti, session } = useContext(Context);

  const isRepresentante = session?.rol === 'representante' || 'ce_ies';
  const isAdmin = session?.rol === 'admin';

  const initialState = typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    : {
      selectedInstitucion: '',
      selectedPlantel: '',
      selectedPrograma: '',
      selectedDocumento: '',
      selectedSolicitud: '',
    };

  const [state, setState] = useState(initialState);
  const [arrays, setArrays] = useState({
    planteles: [],
    programas: [],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    if (isRepresentante && instituciones?.length) {
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
  }, [isRepresentante, instituciones, session, setNoti]);

  const fetchProgramas = useCallback((plantelId) => {
    getProgramas(plantelId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener programas!: ${error.message}`,
          type: 'error',
        });
        setArrays((prevState) => ({ ...prevState, programas: [] }));
      } else if (data?.programas?.length) {
        const transformedProgramas = data.programas.map((programa) => ({
          id: programa.id,
          nombre: `${programa.nombre || ''} ${programa.acuerdoRvoe || ''}`.trim(),
        }));
        setArrays((prevState) => ({ ...prevState, programas: transformedProgramas }));
      }
    });
  }, [setNoti]);

  const fetchPlanteles = useCallback((institucionId) => {
    getPlantelesByInstitucion(institucionId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener planteles!: ${error.message}`,
          type: 'error',
        });
        setArrays((prevState) => ({ ...prevState, planteles: [] }));
      } else if (data?.planteles?.length) {
        const transformedPlanteles = data.planteles.map((plantel) => ({
          id: plantel.id,
          nombre: `${plantel.domicilio?.calle || ''} ${plantel.domicilio?.numeroExterior || ''}`.trim(),
        }));
        setArrays((prevState) => ({ ...prevState, planteles: transformedPlanteles }));
      }
    });
  }, [setNoti]);

  const handleInstitucionChange = (event) => {
    const selectedInstitucion = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedInstitucion,
      selectedPlantel: '',
      selectedPrograma: '',
    }));
  };

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedPlantel: plantelId,
      selectedPrograma: '',
    }));
    const selectedPlantelObject = arrays.planteles.find(
      (plantel) => plantel.id === plantelId,
    );
    setPlantel(selectedPlantelObject?.nombre || '');
    if (plantelId) {
      fetchProgramas(plantelId);
    } else {
      setArrays((prevState) => ({ ...prevState, programas: [] }));
    }
  };

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setState((prevState) => ({
      ...prevState,
      selectedPrograma: programaId,
    }));
  };

  const handleDocumentoChange = (event) => {
    const tipoDocumento = event.target.value;

    setTipoDocumento(tipoDocumento);

    setState((prevState) => ({
      ...prevState,
      selectedDocumento: tipoDocumento,
      selectedSolicitud: tipoDocumento === 1 ? 1 : null,
    }));
  };

  const handleSolicitudChange = (event) => {
    const tipoSolicitud = event.target.value;
    setTipoSolicitud(tipoSolicitud);
    setState((prevState) => ({
      ...prevState,
      selectedSolicitud: tipoSolicitud,
    }));
  };

  useEffect(() => {
    if (state.selectedInstitucion) {
      fetchPlanteles(state.selectedInstitucion);
    } else {
      setArrays((prevState) => ({ ...prevState, planteles: [] }));
    }
  }, [state.selectedInstitucion, fetchPlanteles]);

  useEffect(() => {
    if (state.selectedPlantel) {
      fetchProgramas(state.selectedPlantel);
    } else {
      setArrays((prevState) => ({ ...prevState, programas: [] }));
    }
  }, [state.selectedPlantel, fetchProgramas]);

  useEffect(() => {
    if (state.selectedDocumento) {
      setTipoDocumento(state.selectedDocumento);
    }
  }, [state.selectedDocumento]);

  useEffect(() => {
    if (state.selectedSolicitud) {
      setTipoSolicitud(state.selectedSolicitud);
    }
  }, [state.selectedSolicitud]);

  useEffect(() => {
    if (state.selectedPrograma) {
      setPrograma(state.selectedPrograma);
    }
  }, [state.selectedPrograma]);

  const documentos = [
    { id: 1, nombre: 'Títulos' },
    { id: 2, nombre: 'Certificados' },
  ];

  const solicitudes = [
    { id: 1, nombre: 'Total' },
    { id: 2, nombre: 'Parcial' },
    { id: 3, nombre: 'Duplicado' },
  ];

  const estatus = [
    { id: 1, nombre: 'Enviado' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Asignado' },
    { id: 4, nombre: 'Cancelado' },
  ];

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={state.selectedInstitucion}
          options={instituciones || []}
          onChange={handleInstitucionChange}
          disabled={!isAdmin && isRepresentante}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Planteles"
          name="planteles"
          value={state.selectedPlantel}
          options={arrays.planteles || []}
          onChange={handlePlantelChange}
          disabled={!isAdmin && !state.selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Programas"
          name="programas"
          value={state.selectedPrograma}
          options={arrays.programas || []}
          onChange={handleProgramaChange}
          disabled={!isAdmin && !state.selectedPlantel}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de documento"
          name="documento"
          value={state.selectedDocumento}
          options={documentos || []}
          onChange={handleDocumentoChange}
          disabled={!isAdmin && !state.selectedPrograma}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de solicitud"
          name="solicitud"
          value={state.selectedSolicitud}
          options={solicitudes || []}
          onChange={handleSolicitudChange}
          disabled={!isAdmin && !state.selectedPrograma}
        />
      </Grid>
      {isAdmin && (
        <Grid item xs={4}>
          <Select
            title="Estatus"
            name="estatus"
            multiple
            options={estatus || []}
            onChange={(event) => setEstatus(event.target.value)}
          />
        </Grid>
      )}
    </Grid>
  );
}

FoliosForm.propTypes = {
  setTipoSolicitud: PropTypes.func.isRequired,
  setTipoDocumento: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setPlantel: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setEstatus: PropTypes.func.isRequired,
};
