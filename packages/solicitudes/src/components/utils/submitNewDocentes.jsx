const handleCreate = (
  form,
  setForm,
  setInitialValues,
  setDocentesList,
  hideModal,
  errors,
  setNoti,
  programaId,
  tipo,
) => {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;

  const isValid = Object.keys(errors).every((campo) => errors[campo]());

  if (!isValid) {
    setNoti({
      open: true,
      message: 'Algo salio mal, revisa que los campos esten correctos',
      type: 'error',
    });
    return;
  }

  fetch('http://localhost:3000/api/v1/docentes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', api_key: apikey },
    body: JSON.stringify(form),
  })
    .then((response) => response.json())
    .then((data) => {
      const newData = { ...form, id: data.data.id };
      setDocentesList((prevList) => [...prevList, newData]);
      setForm({ programaId, tipo });
      setInitialValues({});
      hideModal();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export default handleCreate;
