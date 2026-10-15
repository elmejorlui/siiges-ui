import { getToken } from '@siiges-ui/shared';
import { useEffect, useState } from 'react';

export default function getInstitucionesOpciones({
  esNombreAutorizado,
  tipoInstitucionId,
  setLoading,
  refreshKey = 0,
}) {
  const [instituciones, setInstituciones] = useState([]);
  const token = getToken();
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    if (setLoading) setLoading(true);

    const params = new URLSearchParams();
    if (esNombreAutorizado !== undefined) {
      params.set('esNombreAutorizado', String(esNombreAutorizado));
    }
    if (tipoInstitucionId) {
      params.set('tipoInstitucionId', String(tipoInstitucionId));
    }

    const query = params.toString();
    const endpoint = `${url}/api/v1/instituciones/opciones${query ? `?${query}` : ''}`;

    fetch(endpoint, {
      headers: { api_key: apikey, Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al obtener instituciones (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setInstituciones(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((error) => {
        console.error('Error al obtener opciones de instituciones:', error);
        setInstituciones([]);
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  }, [
    apikey,
    esNombreAutorizado,
    refreshKey,
    setLoading,
    tipoInstitucionId,
    token,
    url,
  ]);

  return { instituciones };
}
