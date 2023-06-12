function submitNewLogin(form, errors, setErrorMessages, activateAuth) {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  if (form.usuario !== '' && form.contrasena !== '') {
    fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', api_key: apikey },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        activateAuth(data);
      })
      .catch((err) => {
        console.error('Error:', err);
        setErrorMessages({ name: 'usuario', message: errors.usuario });
      });
  }
}

export default submitNewLogin;
