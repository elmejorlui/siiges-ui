import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import {
  Select, getData, useUI, useAuth,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

export default function CertificadosForm({
  setCertificados, setPrograma, setLoading,
}) {
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });
  const { setNoti } = useUI();
  const { session } = useAuth();

  const [selectedInstitucion, setSelectedInstitucion] = useState('');
  const [selectedPlantel, setSelectedPlantel] = useState('');
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [planteles, setPlanteles] = useState([]);
  const [programas, setProgramas] = useState([]);

  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);

  const fetchCertificados = async (programaId) => {
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

    try {
      const response = await getData({
        endpoint: '/certificadosElectronicos',
        query: `?numeroRvoe=${rvoe}`,
      });

      if (response.statusCode === 200) {
        const certificadosFiltrados = response.data.map((item) => ({
          id: item.id,
          consecutivo: item.consecutivo,
          nombreCompleto: item.nombreCompleto,
          matricula: item.matricula,
          folio: item.folio,
          foja: item.foja,
          libro: item.libro,
          fechaExpedicion: item.fechaExpedicion,
          fechaTerminacion: item.fechaTerminacion,
          folioDocumentoAlumnoId: item.folioDocumentoAlumnoId,
        }));

        setCertificados(certificadosFiltrados);
      } else {
        setNoti({
          open: true,
          message: 'No se encontraron certificados',
          type: 'warning',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `Error al obtener certificados: ${error}`,
        type: 'error',
      });
    }
  };

  const institucionesOrdenadas = instituciones?.slice().sort(
    (a, b) => a.nombre.localeCompare(b.nombre),
  ) || [];

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

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);
    if (programaId) {
      fetchCertificados(programaId);
    } else {
      setCertificados([]);
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
    if (selectedInstitucion) {
      fetchPlanteles(selectedInstitucion);
    } else {
      setPlanteles([]);
    }
  }, [selectedInstitucion]);

  useEffect(() => {
    if (selectedPrograma && programas.length > 0) {
      fetchCertificados(selectedPrograma);
      setPrograma(selectedPrograma);
    }
  }, [selectedPrograma, programas]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={institucionesOrdenadas}
          onChange={(event) => setSelectedInstitucion(event.target.value)}
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

CertificadosForm.propTypes = {
  setCertificados: PropTypes.func.isRequired,
  setPrograma: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
