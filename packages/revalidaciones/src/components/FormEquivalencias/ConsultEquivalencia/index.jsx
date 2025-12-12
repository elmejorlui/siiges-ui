import { Grid } from '@mui/material';
import {
  Context, getData, Input, PositionDisplay,
  Subtitle,
  updateRecord,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import DatosSolicitante from '../Pages/DatosSolicitante';
import DatosInstitucion from '../Pages/DatosInstitucion';
import CargaMateriasEquivalentes from '../Pages/CargaMateriasEquivalentes';
import NavigationButtons from '../../../utils/NavigationButtons';
import ConsultDocumentos from '../Pages/ConsultDocumentos';
import CargaMaterias from '../Pages/CargaMaterias';

export default function ConsultEquivalencia({
  observaciones,
  handleOnChange,
  setEstatus,
  edit,
}) {
  const [currentPosition, setCurrentPosition] = useState(1);
  const router = useRouter();
  const { query } = router;
  const { setNoti, setLoading } = useContext(Context);
  const [filesData, setFilesData] = useState({});
  const [form, setForm] = useState({});
  const [estados, setEstados] = useState([]);
  const [error, setError] = useState(false);

  const totalPositions = 4;

  useEffect(() => {
    if (!query.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const estadosResponse = await getData({ endpoint: '/public/estados/' });
        if (estadosResponse.statusCode !== 200) {
          setError('Error al cargar los estados');
        }
        setEstados(estadosResponse.data);

        const equivalenciaResponse = await getData({ endpoint: `/solicitudesRevEquiv/${query.id}` });
        if (equivalenciaResponse.statusCode !== 200) {
          setError('¡No se encontró esta equivalencia!');
        }
        setForm(equivalenciaResponse.data);
      } catch (err) {
        setError(true);
        setNoti({
          open: true,
          message: err.message,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query.id]);

  useEffect(() => {
    if (form?.estatusSolicitudRevEquivId) {
      setEstatus(form.estatusSolicitudRevEquivId);
    }
  }, [form.estatusSolicitudRevEquivId]);

  if (error) {
    setNoti({
      open: true,
      message: error,
      type: 'error',
    });
  }

  const handleNext = () => {
    if (currentPosition < totalPositions) {
      setCurrentPosition((prevPosition) => prevPosition + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPosition > 1) {
      setCurrentPosition((prevPosition) => prevPosition - 1);
    }
  };

  const handleChange = (event, path = []) => {
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

  const cleanPayload = (data) => {
    if (Array.isArray(data)) {
      return data.map(cleanPayload);
    }

    if (data !== null && typeof data === 'object') {
      const {
        createdAt, updatedAt, deletedAt, ...rest
      } = data;
      return Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key, cleanPayload(value)]),
      );
    }

    return data;
  };

  const handleOnSubmit = async () => {
    try {
      setLoading(true);

      const payload = cleanPayload(form);

      const response = await updateRecord({
        endpoint: `/public/solicitudesRevEquiv?folioSolicitud=${form.folioSolicitud}`,
        data: payload,
      });

      if (response.statusCode !== 201) {
        setNoti({
          open: true,
          message: response.errorMessage || 'Error al actualizar la equivalencia',
          type: 'error',
        });
        return;
      }

      setNoti({
        open: true,
        message: '¡Equivalencia actualizada correctamente!',
        type: 'success',
      });

      router.back();
    } catch (err) {
      setNoti({
        open: true,
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const isObservacionesDisabled = ![2].includes(form.estatusSolicitudRevEquivId);

  const renderCurrentPage = () => {
    switch (currentPosition) {
      case 1:
        return (
          <DatosSolicitante
            tipoSolicitud="equivalencia"
            form={form}
            estados={estados}
            handleOnChange={handleChange}
            disabled={!edit}
          />
        );
      case 2:
        return (
          <DatosInstitucion
            form={form}
            estados={estados}
            handleOnChange={handleChange}
            disabled={!edit}
          />
        );
      case 3:
        return edit ? (
          <CargaMaterias
            form={form}
            filesData={filesData}
            setFilesData={setFilesData}
            edit={edit}
          />
        ) : (
          <ConsultDocumentos id={query.id} />
        );

      case 4:
        return (
          <CargaMateriasEquivalentes
            form={form}
            handleOnChange={handleChange}
            disabled={!edit}
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
        <Subtitle>Observaciones</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Input
          id="observaciones"
          label="Observaciones"
          name="observaciones"
          multiline
          rows={4}
          value={observaciones?.observaciones || form.observaciones || ''}
          onChange={handleOnChange}
          disabled={isObservacionesDisabled}
        />
      </Grid>
      <Grid item xs={12}>
        <NavigationButtons
          currentPosition={currentPosition}
          totalPositions={totalPositions}
          onNext={handleNext}
          onPrevious={handlePrevious}
          handleOnSubmit={handleOnSubmit}
          estatus={form.estatusSolicitudRevEquivId}
          id={form.id}
          type={edit ? 'edit' : 'consult'}
        />
      </Grid>
    </Grid>
  );
}

ConsultEquivalencia.propTypes = {
  observaciones: PropTypes.shape({
    observaciones: PropTypes.string,
  }),
  handleOnChange: PropTypes.func.isRequired,
  setEstatus: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

ConsultEquivalencia.defaultProps = {
  observaciones: { observaciones: '' },
};
