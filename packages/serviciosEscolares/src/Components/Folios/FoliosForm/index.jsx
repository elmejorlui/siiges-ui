import React, { useState, useContext, useEffect } from 'react';
import { Grid } from '@mui/material';
import { Select, Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import {
  getInstituciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';

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

  const [selectedInstitucion, setSelectedInstitucion] = useState('');
  const [planteles, setPlanteles] = useState([]);
  const [selectedPlantel, setSelectedPlantel] = useState('');
  const [programas, setProgramas] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const isRepresentante = session.rol === 'representante';
  const isAdmin = session.rol === 'admin';

  useEffect(() => {
    if (isRepresentante && instituciones?.length) {
      const findIndexIntitucion = instituciones.findIndex(
        ({ usuarioId }) => usuarioId === session.id,
      );
      if (findIndexIntitucion !== -1 && findIndexIntitucion !== undefined) {
        setSelectedInstitucion(instituciones[findIndexIntitucion].id);
      } else {
        setNoti({
          open: true,
          message: '¡No se encontró una institución con nombre autorizado asociada al usuario!.',
          type: 'error',
        });
      }
    }
  }, [isRepresentante, instituciones]);

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setPrograma(programaId);
    setSelectedPrograma(programaId);
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
        const transformedProgramas = data.programas.map((programa) => ({
          id: programa.id,
          nombre: `${programa.nombre} ${programa.acuerdoRvoe}`,
        }));
        setProgramas(transformedProgramas);
      }
    });
  };

  const handlePlantelChange = (event) => {
    const plantelId = event.target.value;
    setSelectedPlantel(plantelId);

    // Find the matching plantel object
    const selectedPlantelObject = planteles.find(
      (plantel) => plantel.id === plantelId,
    );

    // Set the plantel state with the matching plantel object
    setPlantel(selectedPlantelObject.nombre);

    if (plantelId) {
      fetchProgramas(plantelId);
    } else {
      setProgramas([]);
    }
  };

  const handleSolicitudChange = (event) => {
    const tipoSolicitud = event.target.value;
    setTipoSolicitud(tipoSolicitud);
  };

  const handleDocumentoChange = (event) => {
    const tipoDocumento = event.target.value;
    setTipoDocumento(tipoDocumento);
  };

  const handleStatusChange = (event) => {
    const selectedStatuses = event.target.value;
    setEstatus(selectedStatuses);
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
        const transformedPlanteles = data.planteles.map((plantel) => ({
          id: plantel.id,
          nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior}`,
        }));
        setPlanteles(transformedPlanteles);
      }
    });
  };

  useEffect(() => {
    if (selectedInstitucion) {
      try {
        fetchPlanteles(selectedInstitucion);
      } catch (error) {
        setNoti({
          open: true,
          message: `¡Error al buscar los planteles!: ${error.message}`,
          type: 'error',
        });
        setPlanteles([]);
      }
    } else {
      setPlanteles([]);
    }
  }, [selectedInstitucion]);

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
          value={selectedInstitucion}
          options={instituciones || []}
          onChange={(event) => setSelectedInstitucion(event.target.value)}
          disabled={!isAdmin && isRepresentante}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Planteles"
          name="planteles"
          value={selectedPlantel}
          options={planteles || []}
          onChange={handlePlantelChange}
          disabled={!isAdmin && !selectedInstitucion}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Programas"
          name="programas"
          value={selectedPrograma}
          options={programas || []}
          onChange={handleProgramaChange}
          disabled={!isAdmin && !selectedPlantel}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de documento"
          name="documento"
          options={documentos || []}
          onChange={handleDocumentoChange}
          disabled={!isAdmin && !selectedPrograma}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Tipo de solicitud"
          name="solicitud"
          options={solicitudes || []}
          onChange={handleSolicitudChange}
          disabled={!isAdmin && !selectedPrograma}
        />
      </Grid>
      {isAdmin && (
        <Grid item xs={4}>
          <Select
            title="Estatus"
            name="estatus"
            multiple
            options={estatus || []}
            onChange={handleStatusChange}
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
