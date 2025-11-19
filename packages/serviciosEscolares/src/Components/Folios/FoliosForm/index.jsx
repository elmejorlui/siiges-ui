import React, {
  useState, useContext, useEffect, useCallback,
} from 'react';
import { Grid } from '@mui/material';
import { Select, Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import { getInstituciones, getPlantelesByInstitucion, getProgramas } from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

export default function FoliosForm({
  setTipoSolicitud,
  setTipoDocumento,
  setEstatus,
  estatus,
  setPrograma,
  setPlantel,
  setInstitucion,
  setLoading,
}) {
  // eslint-disable-next-line max-len
  const { instituciones } = getInstituciones({ esNombreAutorizado: true, tipoInstitucionId: 1, setLoading });
  const { setNoti, session } = useContext(Context);

  const isRepresentante = session?.rol === 'representante' || session?.rol === 'ce_ies';
  const isAdminOrCeSicyt = session?.rol === 'admin' || session?.rol === 'ce_sicyt';

  const initialState = {
    selectedInstitucion: '',
    selectedPlantel: '',
    selectedPrograma: '',
    selectedDocumento: '',
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
    setTipoDocumento('');
    setTipoSolicitud('');
  };

  const handlePlantelChange = (e) => {
    const selectedPlantel = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedPlantel,
      selectedPrograma: '',
      selectedDocumento: '',
      selectedSolicitud: '',
    }));
    setPlantel(selectedPlantel);
    setPrograma('');
    setTipoDocumento('');
    setTipoSolicitud('');
    if (selectedPlantel) fetchProgramas(selectedPlantel);
    else setArrays((prev) => ({ ...prev, programas: [] }));
  };

  const handleProgramaChange = (e) => {
    const selectedPrograma = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedPrograma,
      selectedDocumento: '',
      selectedSolicitud: '',
    }));
    setPrograma(selectedPrograma);
    setTipoDocumento('');
    setTipoSolicitud('');
  };

  const handleDocumentoChange = (e) => {
    const selectedDocumento = e.target.value;
    setState((prev) => ({ ...prev, selectedDocumento, selectedSolicitud: '' }));
    setTipoDocumento(selectedDocumento);
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

  const documentos = [
    { id: 1, nombre: 'Títulos' },
    { id: 2, nombre: 'Certificados' },
  ];

  const solicitudesTitulos = [
    { id: 1, nombre: 'Duplicado' },
    { id: 3, nombre: 'Total' },
  ];

  const solicitudesCertificados = [
    { id: 1, nombre: 'Duplicado' },
    { id: 2, nombre: 'Parcial' },
    { id: 3, nombre: 'Total' },
  ];

  const getSolicitudesOptions = () => {
    if (state.selectedDocumento === 1) return solicitudesTitulos;
    if (state.selectedDocumento === 2) return solicitudesCertificados;
    return [];
  };

  const estatusOptions = [
    { id: 1, nombre: 'En captura' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Folios asignados' },
    { id: 4, nombre: 'Con observaciones' },
    { id: 5, nombre: 'Cancelado' },
  ].filter((option) => !(session?.rol === 'ce_sicyt' && option.id === 1));

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
          title="Tipo de documento"
          name="documento"
          value={state.selectedDocumento}
          options={documentos}
          onChange={handleDocumentoChange}
          disabled={!state.selectedPrograma}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de solicitud"
          name="solicitud"
          value={state.selectedSolicitud}
          options={getSolicitudesOptions()}
          onChange={handleSolicitudChange}
          disabled={!state.selectedDocumento}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Estatus"
          name="estatus"
          multiple
          value={estatus}
          options={estatusOptions}
          onChange={handleEstatusChange}
        />
      </Grid>
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
  estatus: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  setInstitucion: PropTypes.func.isRequired,
};

FoliosForm.defaultProps = {
  estatus: [],
};
