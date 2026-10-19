import { getTokenLocalStorage } from '@siiges-ui/shared';

const ERROR_MAPPING = {
  400: '¡Revisa que los campos sean correctos!',
  401: '¡Usuario no autorizado!',
  404: '¡Registro no encontrado!',
};

const getFilePdf = async ({ endpoint, query, fileName = 'reporte.pdf' }) => {
  if (!endpoint) {
    return { statusCode: 400, errorMessage: ERROR_MAPPING[400] };
  }

  const { token } = getTokenLocalStorage();
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const domain = process.env.NEXT_PUBLIC_URL;
  const basePath = '/api/v1';
  const url = `${domain}${basePath}${endpoint}${query || ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        api_key: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = ERROR_MAPPING[response.status] || '¡Error Interno del Servidor!';
      return { statusCode: response.status, errorMessage };
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return { statusCode: response.status };
  } catch (error) {
    return { statusCode: 500, errorMessage: '¡Error Interno del Servidor!' };
  }
};

export default getFilePdf;
