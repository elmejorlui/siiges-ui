/* eslint-disable react/no-array-index-key */
import { Carousel, PaperInstitucion, useApi } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import React from 'react';

export default function InstitucionesCarousel({ opdType }) {
  const { data, loading } = useApi({
    endpoint: 'api/v1/instituciones/opciones?tipoInstitucionId=2',
  });

  let url = '/opds/fortalecimiento/planMaestro/';

  if (opdType === 'orgColegiado') {
    url = '/opds/organosColegiados/';
  }
  if (opdType === 'presupuesto') {
    url = '/opds/presupuesto/';
  }
  // Verifica si data está disponible y tiene elementos
  return (
    <Carousel isLoading={loading}>
      {data?.map((institucion) => (
        <PaperInstitucion
          key={institucion.id}
          name={institucion.nombre}
          route={url + institucion.id}
        />
      ))}
    </Carousel>
  );
}

InstitucionesCarousel.propTypes = {
  opdType: PropTypes.string,
};

// Aquí se define el valor predeterminado para opdType
InstitucionesCarousel.defaultProps = {
  opdType: '', // Asegúrate de que este valor predeterminado sea adecuado para tu caso de uso
};
