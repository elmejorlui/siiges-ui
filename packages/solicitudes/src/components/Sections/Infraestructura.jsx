import { Grid, Typography } from '@mui/material';
import { DataTable, getData, Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import columns from './Mocks/Infraestructura';
import PlantelContext from '../utils/Context/plantelContext';
import InfraestructuraCreateModal from '../utils/Components/InfraestructuraModales/InfraestructuraCreateModal';
import useSectionDisabled from './Hooks/useSectionDisabled';

export default function Infraestructura({ disabled, programaId, type }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { infraestructuras, setInfraestructuras, plantelId } = useContext(PlantelContext);
  const { setNoti } = useContext(Context);
  const isSectionDisabled = useSectionDisabled(18);

  const isDisabled = disabled || isSectionDisabled;

  const showModal = useCallback(() => setModalOpen(true), []);
  const hideModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (plantelId) {
      const fetchData = async () => {
        try {
          const response = await getData({
            endpoint: `/planteles/${plantelId}/programas/${programaId}/infraestructuras`,
            query: '',
          });
          if (response && response.data) {
            setInfraestructuras(response.data);
          }
        } catch (err) {
          setNoti({
            open: true,
            message: `¡Error al obtener datos de infraestructura! ${err.message}`,
            type: 'error',
          });
        }
      };
      fetchData();
    }
  }, [plantelId, programaId, setInfraestructuras]);
  const rows = useMemo(
    () => infraestructuras.map((item) => ({
      id: item?.id ?? '',
      tipoInstalacion: item?.tipoInstalacion?.nombre ?? '',
      instalacion: item?.nombre ?? '',
      capacidad: item?.capacidad ?? '',
      metros: item?.metros ?? '',
      recursos: item?.recursos ?? '',
      ubicacion: item?.ubicacion ?? '',
      asignaturas: item?.asignaturasInfraestructura?.length
        ? item.asignaturasInfraestructura
          .map((asignaturaInfra) => asignaturaInfra.asignatura?.nombre ?? '')
          .join(', ')
        : '',
    })),
    [infraestructuras],
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Infraestructura</Typography>
      </Grid>
      <Grid item xs={12}>
        <DataTable
          buttonAdd={!disabled}
          buttonText="Agregar Infraestructura"
          buttonClick={showModal}
          buttonDisabled={isDisabled}
          rows={rows}
          columns={columns(programaId, type, isDisabled)}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Grid>
      <InfraestructuraCreateModal
        open={modalOpen}
        hideModal={hideModal}
        type="crear"
        title="Agregar Infraestructura"
        programaId={programaId}
      />
    </Grid>
  );
}

Infraestructura.propTypes = {
  disabled: PropTypes.bool.isRequired,
  programaId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};
