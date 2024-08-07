import { useContext, useEffect, useState } from 'react';
import { Context, getToken } from '@siiges-ui/shared';

export default function getSolicitudesInspecciones() {
  const { session } = useContext(Context);
  const token = getToken();
  const [solicitudesInspecciones, setSolicitudesInspecciones] = useState();
  const [loading, setLoading] = useState(true);
  let solicitudData = {};
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    if (session !== undefined) {
      fetch(`${url}/api/v1/solicitudes?estatusSolicitudId=6,7`, {
        headers: {
          method: 'GET',
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data !== undefined) {
            solicitudData = data.data;
          }
          setSolicitudesInspecciones(solicitudData);
        });
      setLoading(false);
    }
  }, [session]);

  return {
    solicitudesInspecciones,
    loading,
  };
}
