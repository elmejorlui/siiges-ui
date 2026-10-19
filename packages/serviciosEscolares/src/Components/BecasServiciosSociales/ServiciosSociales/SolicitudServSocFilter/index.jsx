import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import {
  Select, getData, useAuth, useUI,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../../utils/getInstitucionId';

export default function SolicitudServSocFilter({
  setSolicitudes,
  setPrograma,
  setInstitucion,
  setTableEnabled,
}) {
  const { session } = useAuth();
  const { setNoti, setLoading } = useUI();
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const [selectedInstitucion, setSelectedInstitucion] = useState(() => (typeof window !== 'undefined'
    ? localStorage.getItem('servicio_social_selectedInstitucion') || ''
    : ''));

  const [selectedPlantel, setSelectedPlantel] = useState(() => (typeof window !== 'undefined'
    ? localStorage.getItem('servicio_social_selectedPlantel') || ''
    : ''));

  const [selectedPrograma, setSelectedPrograma] = useState(() => (typeof window !== 'undefined'
    ? localStorage.getItem('servicio_social_selectedPrograma') || ''
    : ''));

  const [planteles, setPlanteles] = useState([]);
  const [programas, setProgramas] = useState([]);
  const isIes = session.rol === 'serv_soc_ies';
  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);

  const fetchPlanteles = (institucionId) => {
    setLoading(true);
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
        setInstitucion(institucionId);
        setPlanteles(transformedPlanteles);
      }
      setLoading(false);
    });
  };

  const fetchProgramas = (plantelId) => {
    setLoading(true);
    getProgramas(plantelId, (error, data) => {
      if (error) {
        setNoti({
          open: true,
          message: `¡Error al obtener programas!: ${error.message}`,
          type: 'error',
        });
        setProgramas([]);
      } else {
        setProgramas(data.programas || []);
      }
      setLoading(false);
    });
  };

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const { data } = await getData({
        endpoint: '/solicitudesServicioSocial',
      });
      if (data?.length > 0) {
        const solicitudesMapeadas = data.map((solicitud) => ({
          id: solicitud.id,
          folioSolicitud: solicitud.folioSolicitud,
          programa: solicitud.programa.nombre,
          estatusSolicitudServicioSocial:
            solicitud.estatusSolicitudServicioSocial.nombre,
          createdAt: dayjs(solicitud.createdAt).format('DD/MM/YYYY'),
          domicilio: solicitud.domicilio,
        }));
        setSolicitudes(solicitudesMapeadas);
      } else {
        setSolicitudes([]);
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al obtener solicitudes de servicio social!: ${error.message}`,
        type: 'error',
      });
      setSolicitudes([]);
      setTableEnabled(false);
    } finally {
      setLoading(false);
      setTableEnabled(true);
    }
  };

  useEffect(() => {
    if (selectedInstitucion) fetchPlanteles(selectedInstitucion);
  }, [selectedInstitucion]);

  useEffect(() => {
    if (selectedPlantel) fetchProgramas(selectedPlantel);
  }, [selectedPlantel]);

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);
    if (programaId) fetchSolicitudes();
  };

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      if (!instituciones?.length) return;

      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId) {
        setSelectedInstitucion(institucionId);
      } else if (isRepresentante || isIes) {
        setNoti({
          open: true,
          message: '¡No se encontró una institución con nombre autorizado asociada al usuario!',
          type: 'error',
        });
      }
    };

    asignarInstitucionDesdeSesion();
  }, [instituciones, session]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={
            instituciones
              ?.slice()
              .sort((a, b) => a.nombre.localeCompare(b.nombre)) || []
          }
          onChange={(event) => setSelectedInstitucion(event.target.value)}
          disabled={(isIes || isRepresentante) && selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Planteles"
          name="planteles"
          value={selectedPlantel}
          options={planteles || []}
          onChange={(event) => setSelectedPlantel(event.target.value)}
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

SolicitudServSocFilter.propTypes = {
  setSolicitudes: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setInstitucion: PropTypes.func.isRequired,
  setTableEnabled: PropTypes.func.isRequired,
};
