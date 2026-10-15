import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { getInstitucionesOpciones, getPlantelesByInstitucion } from '@siiges-ui/instituciones';
import { Select, useAuth, useUI } from '@siiges-ui/shared';
import React, { useState, useEffect } from 'react';

export default function ActivarProgramasForm({
  selectedInstitucion,
  setSelectedInstitucion,
  selectedPlantel,
  setSelectedPlantel,
  setLoading,
}) {
  const { setNoti } = useUI();
  const { session } = useAuth();

  const [planteles, setPlanteles] = useState([]);
  const [isPlantelesDisabled, setIsPlantelesDisabled] = useState(true);

  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });
  const institucionesOrdenadas = instituciones?.slice().sort(
    (a, b) => a.nombre.localeCompare(b.nombre),
  ) || [];

  const roles = ['representante', 'ce_ies'];
  const isRepresentante = roles.includes(session.rol);

  useEffect(() => {
    if (selectedInstitucion) {
      getPlantelesByInstitucion(selectedInstitucion, (error, data) => {
        if (error) {
          setNoti({
            open: true,
            message: `¡Error al obtener planteles!: ${error.message}`,
            type: 'error',
          });
          setPlanteles([]);
          setIsPlantelesDisabled(true);
        } else {
          const transformedPlanteles = data.planteles
            .map((plantel) => ({
              id: plantel.id,
              nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior} | CCT: ${plantel.claveCentroTrabajo}`,
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

          setPlanteles(transformedPlanteles);
          setIsPlantelesDisabled(false);
        }
      });
    } else {
      setPlanteles([]);
      setIsPlantelesDisabled(true);
    }
  }, [selectedInstitucion]);

  const handleInstitucionChange = (event) => {
    setSelectedInstitucion(event.target.value);
    setSelectedPlantel('');
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <Select
          title="Instituciones"
          name="instituciones"
          value={selectedInstitucion}
          options={institucionesOrdenadas}
          onChange={handleInstitucionChange}
          disabled={isRepresentante}
        />
      </Grid>
      <Grid item xs={6}>
        <Select
          title="Planteles"
          name="planteles"
          value={selectedPlantel}
          options={planteles || []}
          onChange={(event) => setSelectedPlantel(event.target.value)}
          disabled={isPlantelesDisabled}
        />
      </Grid>
    </Grid>
  );
}

ActivarProgramasForm.propTypes = {
  selectedInstitucion: PropTypes.string.isRequired,
  setSelectedInstitucion: PropTypes.func.isRequired,
  selectedPlantel: PropTypes.string.isRequired,
  setSelectedPlantel: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
