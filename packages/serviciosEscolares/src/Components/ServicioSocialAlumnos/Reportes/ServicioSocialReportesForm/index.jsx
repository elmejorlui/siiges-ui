import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ButtonSimple, Select, useAuth } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import {
  getInstituciones,
} from '@siiges-ui/instituciones';
import getInstitucionIdFromSession from '../../../utils/getInstitucionId';

const ROLES_INSTITUCION_FIJA = ['representante', 'ce_ies'];

export default function ServicioSocialReportesForm({
  tipoReporte, setTipoReporte, selectedInstitucion,
  setSelectedInstitucion, onSearch, setLoading,
}) {
  const { session } = useAuth();

  const { instituciones: fetchedInstituciones } = getInstituciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const isRepresentante = ROLES_INSTITUCION_FIJA.includes(session.rol);

  const [instituciones, setInstituciones] = useState([]);

  useEffect(() => {
    if (fetchedInstituciones?.length) {
      setInstituciones(
        [...fetchedInstituciones].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      );
    }
  }, [fetchedInstituciones]);

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      if (!isRepresentante || !instituciones?.length) return;

      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId) {
        setSelectedInstitucion(institucionId);
      }
    };

    asignarInstitucionDesdeSesion();
  }, [isRepresentante, instituciones]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Tabs
          value={tipoReporte}
          onChange={(event, newValue) => setTipoReporte(newValue)}
        >
          <Tab label="General (Instituciones)" />
          <Tab label="Por institución (Programas)" />
        </Tabs>
      </Grid>
      <Grid item xs={9}>
        <Select
          title="Institución"
          name="institucion"
          value={selectedInstitucion || ''}
          options={instituciones}
          onChange={(event) => setSelectedInstitucion(event.target.value)}
          disabled={tipoReporte === 0 || isRepresentante}
        />
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <ButtonSimple
          text="Buscar"
          onClick={onSearch}
          design="buscar"
          fullWidth
        >
          <SearchIcon />
        </ButtonSimple>
      </Grid>
    </Grid>
  );
}

ServicioSocialReportesForm.propTypes = {
  tipoReporte: PropTypes.number.isRequired,
  setTipoReporte: PropTypes.func.isRequired,
  selectedInstitucion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setSelectedInstitucion: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

ServicioSocialReportesForm.defaultProps = {
  selectedInstitucion: '',
};
