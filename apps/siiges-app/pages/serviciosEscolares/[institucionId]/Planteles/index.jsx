import { useRouter } from 'next/router';
import { PlantelesInstitucionesAuth } from '@siiges-ui/instituciones';
import React from 'react';
import { Layout, useApi } from '@siiges-ui/shared';

export default function Index() {
  const router = useRouter();
  const { institucionId } = router.query;
  const { data: institucion, loading } = useApi({
    endpoint: institucionId ? `api/v1/instituciones/${institucionId}/planteles` : '',
  });

  return (
    <Layout title="Planteles">
      {!loading && institucion && (
        <PlantelesInstitucionesAuth
          institucion={institucion.id}
          data={institucion.planteles || []}
        />
      )}
    </Layout>
  );
}
