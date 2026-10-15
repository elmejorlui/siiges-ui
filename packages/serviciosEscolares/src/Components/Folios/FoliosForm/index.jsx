import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from '@mui/material';
import { Select, useAuth, useUI } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstitucionesOpciones, getPlantelesByInstitucion, getProgramas,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

export default function FoliosForm({
  setTipoSolicitud,
  setEstatus,
  estatus,
  setPrograma,
  setPlantel,
  setInstitucion,
  setLoading,
  tipoDocumento,
}) {
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });
  const { setNoti } = useUI();
  const { session } = useAuth();

  const isRepresentante = session?.rol === 'representante' || session?.rol === 'ce_ies';
  const isAdminOrCeSicyt = session?.rol === 'admin' || session?.rol === 'ce_sicyt';

  const initialState = {
    selectedInstitucion: '',
    selectedPlantel: '',
    selectedPrograma: '',
    selectedSolicitud: '',
  };

  const [state, setState] = useState(initialState);
  const [arrays, setArrays] = useState({ planteles: [], programas: [] });

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      if (isAdminOrCeSicyt) return;
      if (!instituciones || instituciones.length === 0 || !session) return;

      const institucionId = await getInstitucionIdFromSession({ instituciones, session });
      if (institucionId) {
        setState((prev) => ({ ...prev, selectedInstitucion: institucionId }));
        setInstitucion(institucionId);
      } else if (isRepresentante) {
        setNoti({ open: true, message: '¡No se encontró una institución asociada al usuario!', type: 'error' });
      }
    };
    asignarInstitucionDesdeSesion();
  }, [instituciones, session]);

  const fetchPlanteles = useCallback((institucionId) => {
    getPlantelesByInstitucion(institucionId, (error, data) => {
      if (error) {
        setNoti({ open: true, message: `¡Error al obtener planteles!: ${error.message}`, type: 'error' });
        setArrays((prev) => ({ ...prev, planteles: [] }));
      } else {
        const transformed = data?.planteles?.map((p) => ({
          id: p.id,
          nombre: `${p.domicilio.calle} ${p.domicilio.numeroExterior} | CCT: ${p.claveCentroTrabajo}`,
        })) || [];
        setArrays((prev) => ({ ...prev, planteles: transformed }));
      }
    });
  }, [setNoti]);

  const fetchProgramas = useCallback((PlantelId) => {
    getProgramas(PlantelId, (error, data) => {
      if (error) {
        setNoti({ open: true, message: `¡Error al obtener programas!: ${error.message}`, type: 'error' });
        setArrays((prev) => ({ ...prev, programas: [] }));
      } else {
        const transformed = data?.programas?.map((p) => ({
          id: p.id,
          nombre: `${p.nombre || ''} ${p.acuerdoRvoe || ''}`.trim(),
        })) || [];
        setArrays((prev) => ({ ...prev, programas: transformed }));
      }
    });
  }, [setNoti]);

  const handleInstitucionChange = (e) => {
    const selectedInstitucion = e.target.value;
    setState({ ...initialState, selectedInstitucion });
    setInstitucion(selectedInstitucion);
    setPlantel('');
    setPrograma('');
    setTipoSolicitud('');
  };

  const handlePlantelChange = (e) => {
    const selectedPlantel = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedPlantel,
      selectedPrograma: '',
      selectedSolicitud: '',
    }));
    setPlantel(selectedPlantel);
    setPrograma('');
    setTipoSolicitud('');
    if (selectedPlantel) fetchProgramas(selectedPlantel);
    else setArrays((prev) => ({ ...prev, programas: [] }));
  };

  const handleProgramaChange = (e) => {
    const selectedPrograma = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedPrograma,
      selectedSolicitud: '',
    }));
    setPrograma(selectedPrograma);
    setTipoSolicitud('');
  };

  const handleSolicitudChange = (e) => {
    const selectedSolicitud = e.target.value;
    setState((prev) => ({ ...prev, selectedSolicitud }));
    setTipoSolicitud(selectedSolicitud);
  };

  const handleEstatusChange = (e) => {
    const selectedIds = e.target.value || [];
    setEstatus(selectedIds);
  };

  const solicitudesTitulos = [
    // { id: 1, nombre: 'Duplicado' },
    { id: 3, nombre: 'Total' },
  ];

  const solicitudesCertificados = [
    // { id: 1, nombre: 'Duplicado' },
    { id: 2, nombre: 'Parcial' },
    { id: 3, nombre: 'Total' },
  ];

  const getSolicitudesOptions = () => {
    if (tipoDocumento === 1) return solicitudesTitulos;
    if (tipoDocumento === 2) return solicitudesCertificados;
    return [];
  };

  const estatusOptionsTitulo = [
    { id: 1, nombre: 'En captura' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Folios asignados' },
    { id: 4, nombre: 'Con observaciones' },
    { id: 5, nombre: 'Cancelado' },
  // { id: 6, nombre: 'Envíado a titulación' },
  // { id: 7, nombre: 'Envío parcial a titulación' },
  ];

  const estatusOptionsCertificado = [
    { id: 1, nombre: 'En captura' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Folios asignados' },
    { id: 4, nombre: 'Con observaciones' },
    { id: 5, nombre: 'Cancelado' },
    { id: 8, nombre: 'Firma parcial certificado IES' },
    { id: 9, nombre: 'Firma certificado IES' },
    { id: 10, nombre: 'Firma parcial certificado SICYT' },
    { id: 11, nombre: 'Firma certificado SICYT' },
  ];

  const getEstatusOptions = () => {
    const options = tipoDocumento === 1 ? estatusOptionsTitulo : estatusOptionsCertificado;
    return options.filter((option) => !(session?.rol === 'ce_sicyt' && option.id === 1));
  };

  useEffect(() => {
    if (state.selectedInstitucion) fetchPlanteles(state.selectedInstitucion);
    else setArrays((prev) => ({ ...prev, planteles: [], programas: [] }));
  }, [state.selectedInstitucion, fetchPlanteles]);

  useEffect(() => {
    if (state.selectedPlantel) fetchProgramas(state.selectedPlantel);
    else setArrays((prev) => ({ ...prev, programas: [] }));
  }, [state.selectedPlantel, fetchProgramas]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={state.selectedInstitucion}
          options={instituciones || []}
          onChange={handleInstitucionChange}
          disabled={!isAdminOrCeSicyt && isRepresentante}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Planteles"
          name="planteles"
          value={state.selectedPlantel}
          options={arrays.planteles || []}
          onChange={handlePlantelChange}
          disabled={!state.selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Programas"
          name="programas"
          value={state.selectedPrograma}
          options={arrays.programas || []}
          onChange={handleProgramaChange}
          disabled={!state.selectedPlantel}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de solicitud"
          name="solicitud"
          value={state.selectedSolicitud}
          options={getSolicitudesOptions()}
          onChange={handleSolicitudChange}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Estatus"
          name="estatus"
          multiple
          value={estatus}
          options={getEstatusOptions()}
          onChange={handleEstatusChange}
        />
      </Grid>
    </Grid>
  );
}

FoliosForm.propTypes = {
  setTipoSolicitud: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setPlantel: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setEstatus: PropTypes.func.isRequired,
  estatus: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  setInstitucion: PropTypes.func.isRequired,
  tipoDocumento: PropTypes.number.isRequired,
};

FoliosForm.defaultProps = {
  estatus: [],
};
