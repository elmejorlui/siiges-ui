import { getToken } from '@siiges-ui/shared';

export default async function getProgramaById(programaId) {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;
  const token = getToken();

  const response = await fetch(
    `${url}/api/v1/programas/${programaId}`,
    {
      headers: { api_key: apikey, Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener el programa');
  }

  const { data } = await response.json();
  return {
    data,
    nivelId: data?.nivelId || data?.nivel?.id || null,
    nivelNombre: data?.nivel?.nombre || null,
  };
}
