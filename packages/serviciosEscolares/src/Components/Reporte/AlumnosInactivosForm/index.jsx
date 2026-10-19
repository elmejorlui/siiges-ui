import React, { useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import {
  ButtonSimple, Select, useAuth, useUI,
} from '@siiges-ui/shared';
import {
  getInstitucionesOpciones,
  getPlantelesByInstitucion,
  getProgramas,
} from '@siiges-ui/instituciones';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import getInstitucionIdFromSession from '../../utils/getInstitucionId';

const LOCAL_STORAGE_KEY = 'alumnosInactivosFormState';
const ROLES_INSTITUCION_FIJA = ['representante', 'ce_ies'];

export default function AlumnosInactivosForm({
  formData,
  setFormData,
  onSearch,
  setLoading,
}) {
  const { setNoti } = useUI();
  const { session } = useAuth();
  const { instituciones } = getInstitucionesOpciones({
    esNombreAutorizado: true,
    tipoInstitucionId: 1,
    setLoading,
  });

  const [planteles, setPlanteles] = useState([]);
  const [programas, setProgramas] = useState([]);

  const isRepresentante = ROLES_INSTITUCION_FIJA.includes(session.rol);

  const hydratedRef = useRef(false);

  const handleInstitucionChange = (institucionId) => {
    setFormData((prev) => ({
      ...prev,
      institucion: institucionId,
      plantel: '',
      programa: '',
    }));
    setPlanteles([]);
    setProgramas([]);

    if (institucionId) {
      getPlantelesByInstitucion(institucionId, (error, data) => {
        if (error) {
          setNoti({
            open: true,
            message: '¡No se encontraron planteles!',
            type: 'warning',
          });
        } else {
          const sorted = data.planteles
            .map((p) => ({
              id: p.id,
              nombre: `${p.domicilio.calle} ${p.domicilio.numeroExterior} | CCT: ${p.claveCentroTrabajo}`,
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
          setPlanteles(sorted);
        }
      });
    }
  };

  const handlePlantelChange = (plantelId) => {
    setFormData((prev) => ({ ...prev, plantel: plantelId, programa: '' }));
    setProgramas([]);

    if (plantelId) {
      getProgramas(plantelId, (error, data) => {
        if (error) {
          setNoti({
            open: true,
            message: '¡No se encontraron programas!',
            type: 'warning',
          });
        } else {
          const sorted = data.programas
            .map((p) => ({
              id: p.id,
              nombre: `${p.nombre} ${p.acuerdoRvoe}`,
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
          setProgramas(sorted);
        }
      });
    }
  };

  const handleProgramaChange = (programaId) => {
    setFormData((prev) => ({ ...prev, programa: programaId }));
  };

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const isEmpty = !formData.institucion && !formData.plantel && !formData.programa;

      if (isEmpty && !isRepresentante) {
        setFormData((prev) => ({ ...prev, ...parsed }));

        if (parsed.institucion) {
          handleInstitucionChange(parsed.institucion);
        }
        if (parsed.plantel) {
          handlePlantelChange(parsed.plantel);
        }
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const asignarInstitucionDesdeSesion = async () => {
      const institucionId = await getInstitucionIdFromSession({
        instituciones,
        session,
      });

      if (institucionId && institucionId !== formData.institucion) {
        handleInstitucionChange(institucionId);
      }
    };

    if (isRepresentante) {
      asignarInstitucionDesdeSesion();
    }
  }, [instituciones, session]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          title="Institución"
          name="institucion"
          value={formData.institucion || ''}
          options={
            instituciones?.sort((a, b) => a.nombre.localeCompare(b.nombre))
            || []
          }
          onChange={(e) => handleInstitucionChange(e.target.value)}
          disabled={isRepresentante}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          title="Plantel"
          name="plantel"
          value={formData.plantel || ''}
          options={planteles}
          onChange={(e) => handlePlantelChange(e.target.value)}
          disabled={!formData.institucion}
        />
      </Grid>
      <Grid item xs={5}>
        <Select
          title="Programa"
          name="programa"
          value={formData.programa || ''}
          options={programas}
          onChange={(e) => handleProgramaChange(e.target.value)}
          disabled={!formData.plantel}
        />
      </Grid>

      <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
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

AlumnosInactivosForm.propTypes = {
  formData: PropTypes.shape({
    programa: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    institucion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    plantel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    busquedaGeneralTexto: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
