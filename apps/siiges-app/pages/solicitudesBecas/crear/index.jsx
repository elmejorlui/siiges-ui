import React, { useState } from 'react';
import { Layout } from '@siiges-ui/shared';
import { BecasComponents } from '@siiges-ui/serviciosescolares';

export default function AgregarSolicitudBecas() {
  const [loading, setLoading] = useState(false);
  return (
    <Layout title="Agregar Solicitud de Becas" loading={loading}>
      <BecasComponents.SolicitudesBecasBox setLoading={setLoading} type="crear" />
    </Layout>
  );
}
