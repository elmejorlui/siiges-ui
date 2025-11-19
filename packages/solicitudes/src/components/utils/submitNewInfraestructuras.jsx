import { getToken } from '@siiges-ui/shared';

const handleCreate = (
  form,
  setForm,
  setInitialValues,
  setInfraestructuras,
  hideModal,
  errors,
  setNoti,
  plantelId,
  setLoading,
) => {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;
  const token = getToken();

  const isValid = Object.keys(errors).every((campo) => errors[campo]());

  if (!isValid) {
    setNoti({
      open: true,
      message: '¡Algo salió mal, revisa que los campos estén correctos!',
      type: 'error',
    });
    return;
  }

  hideModal();
  setLoading(true);

  fetch(`${url}/api/v1/planteles/${plantelId}/infraestructuras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: apikey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  })
    .then((response) => response.json())
    .then((data) => {
      const newId = data.data.id;

      return fetch(`${url}/api/v1/planteles/${plantelId}/infraestructuras/${newId}`, {
        headers: {
          'Content-Type': 'application/json',
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((res) => res.json())
    .then((fullData) => {
      setInfraestructuras((prevList) => [...prevList, fullData.data]);
      setForm({ plantelId });
      setInitialValues({});
      setNoti({
        open: true,
        message: '¡Se creó la infraestructura exitosamente!',
        type: 'success',
      });
      setLoading(false);
    })
    .catch((error) => {
      setNoti({
        open: true,
        message: `¡Ocurrió un error al cargar los datos!: ${error}`,
        type: 'error',
      });
      setLoading(false);
    });
};

export default handleCreate;
