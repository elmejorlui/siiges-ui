import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@mui/material';
import SectionLayout from '../../SectionLayout';
import pagination from '../../../events/pagination';
import AnexosSeccion from '../../Sections/AnexosSeccion';
import Observaciones from '../../Sections/Observaciones';

export default function Anexos({
  nextModule,
  id,
  type,
  isDisabled: parentDisabled,
  solicitud,
  tipoSolicitudId,
}) {
  const [form, setForm] = useState([]);

  const {
    next, prev, section, position, porcentaje,
  } = pagination(useState, 1);

  const isDisabled = parentDisabled || id === undefined;

  return (
    <Card sx={{ mt: 3, mb: 3 }}>
      <CardContent>
        <SectionLayout
          type={type}
          sectionTitle="Anexos"
          sections={section}
          position={position}
          total="1"
          id={id}
          porcentage={porcentaje}
          nextModule={nextModule}
          next={next}
          prev={prev}
        >
          {section === 1 && (
            <AnexosSeccion
              form={form}
              setForm={setForm}
              disabled={isDisabled}
              id={id}
              type={type}
              institucionId={solicitud?.programa?.plantel?.institucionId}
              plantelId={solicitud?.programa?.plantelId}
              programaId={solicitud?.programa?.id}
              usuarioId={solicitud?.usuarioId}
              tipoSolicitudId={tipoSolicitudId}
            />
          )}
          <Observaciones id={id} section={section + 19} />
        </SectionLayout>
      </CardContent>
    </Card>
  );
}

Anexos.defaultProps = {
  id: null,
  type: null,
};

Anexos.propTypes = {
  nextModule: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  tipoSolicitudId: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
  solicitud: PropTypes.shape({
    programa: PropTypes.shape({
      id: PropTypes.number,
      plantelId: PropTypes.number,
      plantel: PropTypes.shape({
        institucionId: PropTypes.number,
      }),
    }),
    usuarioId: PropTypes.number,
  }).isRequired,
};
