import { Grid } from '@mui/material';
import { Context, PositionDisplay } from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatosSolicitante from './Pages/DatosSolicitante';
import DatosInstitucion from './Pages/DatosInstitucion';
import CargaMaterias from './Pages/CargaMaterias';
import CargaMateriasEquivalentes from './Pages/CargaMateriasEquivalentes';
import NavigationButtons from '../../utils/NavigationButtons';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

export default function FormEquivalencias() {
  const { setNoti } = useContext(Context);
  const router = useRouter();
  const [currentPosition, setCurrentPosition] = useState(1);
  const [filesData, setFilesData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validateFields, setValidateFields] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [form, setForm] = useState({
    tipoTramiteId: null,
    estatusSolicitudRevEquivId: 1,
    fecha: new Date().toISOString().split('T')[0],
    interesado: {
      persona: {
        domicilio: {
          calle: '',
          numeroExterior: '',
          numeroInterior: '',
          colonia: '',
          codigoPostal: '',
          municipioId: '',
          estadoId: '',
          sexo: '',
        },
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        celular: '',
        nacionalidad: '',
        curp: '',
        correoPrimario: '',
      },
      institucionProcedencia: {
        tipoInstitucionId: 1,
        nombre: '',
        paisId: 148,
        estadoId: '',
        nivelId: null,
        nombreCarrera: '',
      },
      institucionDestino: {
        tipoInstitucionId: 1,
        programaId: '',
        nombre: '',
        acuerdoRvoe: '',
        nombreCarrera: '',
        nivel: '',
      },
      asignaturasAntecedentesEquivalentes: [],
    },
  });
  const [estados, setEstados] = useState([]);
  const totalPositions = 4;

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch(`${domain}/api/v1/public/estados/`, {
          headers: {
            api_key: apiKey,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEstados(data.data);
      } catch (error) {
        console.error('¡Error al buscar Estados!:', error);
      }
    };

    fetchEstados();
  }, []);

  const handleNext = () => {
    setValidateFields(true);
    if (!nextDisabled) {
      if (currentPosition < totalPositions) {
        setCurrentPosition((prevPosition) => prevPosition + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPosition > 1) {
      setCurrentPosition((prevPosition) => prevPosition - 1);
    }
  };

  const handleOnChange = (event, path = []) => {
    const { name, value } = event.target;

    setForm((prevForm) => {
      const updateNestedValue = (obj, nestedPath) => {
        if (nestedPath.length === 0) {
          return { ...obj, [name]: value };
        }

        const [firstKey, ...restPath] = nestedPath;
        return {
          ...obj,
          [firstKey]: updateNestedValue(obj[firstKey] || {}, restPath),
        };
      };

      return updateNestedValue(prevForm, path);
    });
  };

  console.log(form);

  const handleOnSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData();

    try {
      Object.keys(filesData).forEach((key) => {
        const archivoAdjunto = filesData[key].formData.get('archivoAdjunto');
        if (archivoAdjunto) {
          formData.append(key, archivoAdjunto);
        } else {
          console.error(`¡No se encontró el archivo para ${key}!`);
        }
      });

      formData.append('DATA', JSON.stringify(form));

      const response = await fetch(`${domain}/api/v1/public/solicitudesRevEquiv/`, {
        method: 'POST',
        headers: {
          api_key: apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('¡Error al enviar el formulario!');
      }

      setNoti({
        open: true,
        message: 'Se envió la solicitud con éxito',
        type: 'success',
      });
      router.reload();
    } catch (error) {
      console.error('¡Error al enviar el formulario!', error);
      setNoti({
        open: true,
        message: '¡Ocurrió un error al enviar la solicitud, intente de nuevo!',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPosition) {
      case 1:
        return (
          <DatosSolicitante
            tipoSolicitud="equivalencia"
            form={form}
            handleOnChange={handleOnChange}
            estados={estados}
            validateFields={validateFields}
            setNextDisabled={setNextDisabled}
          />
        );
      case 2:
        return (
          <DatosInstitucion
            form={form}
            handleOnChange={handleOnChange}
            estados={estados}
            validateFields={validateFields}
            setNextDisabled={setNextDisabled}
          />
        );
      case 3:
        return (
          <CargaMaterias
            form={form}
            filesData={filesData}
            setFilesData={setFilesData}
          />
        );
      case 4:
        return (
          <CargaMateriasEquivalentes
            form={form}
            handleOnChange={handleOnChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <PositionDisplay
          currentPosition={currentPosition}
          totalPositions={totalPositions}
        />
      </Grid>
      <Grid item xs={12}>
        {renderCurrentPage()}
      </Grid>
      <Grid item xs={12}>
        <NavigationButtons
          currentPosition={currentPosition}
          totalPositions={totalPositions}
          onNext={handleNext}
          onPrevious={handlePrevious}
          handleOnSubmit={handleOnSubmit}
          isSubmitting={isSubmitting}
        />
      </Grid>
    </Grid>
  );
}
