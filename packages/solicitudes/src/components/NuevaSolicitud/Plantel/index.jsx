import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Card, CardContent } from '@mui/material';
import { getInstitucionUsuario } from '@siiges-ui/instituciones';
import { Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import SectionLayout from '../../SectionLayout';
import pagination from '../../../events/pagination';
import DatosPlantel from '../../Sections/DatosPlantel';
import DescripcionPlantel from '../../Sections/DescripcionPlantel';
import HigienePlantel from '../../Sections/HigienePlantel';
import InstitucionesAledanas from '../../Sections/InstitucionesAledanas';
import Infraestructura from '../../Sections/Infraestructura';
import RatificacionNombre from '../../Sections/RatificacionNombre';
import NombresPropuestos from '../../Sections/NombresPropuestos';
import { PlantelProvider } from '../../utils/Context/plantelContext';
import Observaciones from '../../Sections/Observaciones';

export default function Plantel({
  nextModule,
  id,
  programaId,
  type,
  solicitud,
  isDisabled,
  tipoSolicitudId,
}) {
  const [disabled, setDisabled] = useState(true);
  const { session } = useContext(Context);
  const { institucion } = getInstitucionUsuario(session, solicitud?.usuarioId);
  const [plantelesData, setPlantelesData] = useState({});
  const [selectedPlantel, setSelectedPlantel] = useState();

  useEffect(() => {
    setDisabled(isDisabled === true || id == null);
  }, [id, isDisabled]);

  useEffect(() => {
    if (solicitud?.programa) {
      setSelectedPlantel(solicitud.programa.plantelId);
    }
  }, [solicitud]);

  const ratificacion = useMemo(() => {
    if (!institucion) return <RatificacionNombre disabled={disabled} />;

    if (
      !institucion.ratificacionNombre
      || (Array.isArray(institucion.ratificacionNombre)
        && institucion.ratificacionNombre.some((item) => !item.esNombreAutorizado))
    ) {
      return (
        <NombresPropuestos
          disabled={disabled}
          id={institucion.id}
          institucion={institucion}
        />
      );
    }
    return <RatificacionNombre disabled={disabled} />;
  }, [institucion, disabled]);

  const {
    next, prev, section, position, porcentaje,
  } = pagination(useState, tipoSolicitudId === 2 ? 2 : 6);

  const sectionsMap = useMemo(() => {
    if (tipoSolicitudId === 2) {
      return [
        {
          id: 1,
          component: (
            <DatosPlantel
              disabled={disabled}
              plantelesData={plantelesData}
              setPlantelesData={setPlantelesData}
              usuarioId={solicitud?.usuarioId}
              type={type}
            />
          ),
        },
        {
          id: 2,
          component: (
            <Infraestructura
              disabled={disabled}
              programaId={programaId}
              type={type}
            />
          ),
        },
      ];
    }

    return [
      {
        id: 1,
        component: (
          <DatosPlantel
            disabled={disabled}
            plantelesData={plantelesData}
            setPlantelesData={setPlantelesData}
            usuarioId={solicitud?.usuarioId}
            type={type}
          />
        ),
      },
      {
        id: 2,
        component: (
          <DescripcionPlantel
            disabled={disabled}
            plantelesData={plantelesData}
            setPlantelesData={setPlantelesData}
            type={type}
          />
        ),
      },
      {
        id: 3,
        component: (
          <HigienePlantel
            disabled={disabled}
            plantelId={plantelesData?.id}
            type={type}
          />
        ),
      },
      {
        id: 4,
        component: (
          <InstitucionesAledanas
            disabled={disabled}
            programaId={programaId}
            type={type}
          />
        ),
      },
      {
        id: 5,
        component: (
          <Infraestructura
            disabled={disabled}
            programaId={programaId}
            type={type}
          />
        ),
      },
      {
        id: 6,
        component: ratificacion,
      },
    ];
  }, [tipoSolicitudId, disabled, plantelesData, solicitud, programaId, ratificacion, type]);

  const activeSection = sectionsMap.find((s) => s.id === section);

  if (!institucion) return null;

  return (
    <Card sx={{ mt: 3, mb: 3 }}>
      <CardContent>
        <PlantelProvider
          selectedPlantel={selectedPlantel}
          institucion={institucion}
        >
          <SectionLayout
            type={type}
            sectionTitle="Plantel"
            sections={section}
            position={position}
            total={sectionsMap.length}
            porcentaje={porcentaje}
            nextModule={nextModule}
            next={next}
            prev={prev}
            id={id}
          >
            {activeSection?.component}
            <Observaciones id={id} section={section + 13} type={type} />
          </SectionLayout>
        </PlantelProvider>
      </CardContent>
    </Card>
  );
}

Plantel.defaultProps = {
  id: null,
  programaId: null,
  type: '',
  solicitud: {},
};

Plantel.propTypes = {
  nextModule: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  programaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  tipoSolicitudId: PropTypes.number.isRequired,
  solicitud: PropTypes.shape({
    id: PropTypes.number,
    usuarioId: PropTypes.number,
    programa: PropTypes.shape({
      plantelId: PropTypes.number,
      plantel: PropTypes.shape({
        institucion: PropTypes.shape({
          id: PropTypes.number,
        }),
      }),
    }),
  }),
};
