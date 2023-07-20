import { useContext, useEffect, useState } from 'react';
import { Context } from '@siiges-ui/shared';

export default function getAsignaturas(programaId) {
  const { session } = useContext(Context);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  let asignaturasData = {};

  useEffect(() => {
    if (session !== undefined) {
      fetch(`http://localhost:3000/api/v1/asignaturas/programas/${programaId}`, {
        headers: {
          method: 'GET',
          api_key: apikey,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(true);
          if (data !== undefined) {
            asignaturasData = data.data;
          }
          setAsignaturas(asignaturasData);
        });
      setLoading(false);
    }
  }, [session]);

  return {
    asignaturas,
    loading,
  };
}
