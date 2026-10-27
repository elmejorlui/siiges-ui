import { getToken } from '@siiges-ui/shared';
import { useEffect, useState } from 'react';

export default function getUsuarioById(usuarioId) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    if (!usuarioId) {
      setUser(undefined);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${url}/api/v1/usuarios/${usuarioId}/detalle`, {
      headers: {
        api_key: apikey,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setUser(data.data);
      })
      .catch((error) => console.error('Error al obtener el usuario:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [usuarioId]);

  return { user, loading };
}
