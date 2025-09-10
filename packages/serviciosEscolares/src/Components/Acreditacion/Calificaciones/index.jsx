import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import {
  Button,
  ButtonSimple,
  Context,
  DataTable,
  DefaultModal,
  getData,
} from '@siiges-ui/shared';
import Router, { useRouter } from 'next/router';
import columnsInscritosOrdinario from '../../../Tables/columnsInscritosOrdinario';
import submitCalificaciones from '../../utils/submitCalificaciones';
import getAlumnosAcreditacion from '../../utils/getAlumnosAcreditacion';

export default function Calificaciones({
  disabled,
  labelAsignatura,
  alumnos,
  grupoId,
  asignaturaId,
  programaId,
  setAlumnos,
}) {
  const [calificaciones, setCalificaciones] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState();
  const [calificacionMinima, setCalificacionMinima] = useState(null);
  const [calificacionMaxima, setCalificacionMaxima] = useState(null);
  const [calificacionDecimal, setCalificacionDecimal] = useState(false);
  const [fechaExamenes] = useState();
  const [open, setOpen] = useState(false);

  const url = '/serviciosEscolares/programas';

  const { setNoti } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    const fetchCalificacion = async () => {
      try {
        const result = await getData({ endpoint: `/programas/${programaId}` });
        if (result.statusCode === 200) {
          setCalificacionMinima(result.data.calificacionMinima || 0);
          setCalificacionMaxima(result.data.calificacionMaxima);
          setCalificacionDecimal(result.data.calificacionDecimal);
          if (result.data.calificacionMaxima === '' && result.data.calificacionAprobatoria === '') {
            setOpen(true);
          }
        } else {
          setNoti({
            open: true,
            message: '¡Error al obtener los datos de calificación!',
            type: 'error',
          });
        }
      } catch (error) {
        setNoti({
          open: true,
          message: '¡Error al obtener los datos de calificación!',
          type: 'error',
        });
      }
    };

    if (programaId) {
      fetchCalificacion();
    }
  }, [programaId]);

  useEffect(() => {
    if (response) {
      const reloadAlumnos = async () => {
        try {
          const alumnosActualizados = await getAlumnosAcreditacion(
            asignaturaId,
            grupoId,
          );
          if (alumnosActualizados) {
            setAlumnos(alumnosActualizados);
          } else {
            setNoti({
              open: true,
              message: '¡Error al actualizar los datos!',
              type: 'error',
            });
          }
        } catch (error) {
          setNoti({
            open: true,
            message: '¡Error al actualizar los datos!',
            type: 'error',
          });
        }
      };
      reloadAlumnos();
    }
  }, [response]);

  const updateCalificaciones = (
    alumnoId,
    newValue,
    fieldToUpdate,
    tipo = 1,
  ) => {
    setCalificaciones((prevCalificaciones) => {
      const existingIndex = prevCalificaciones.findIndex(
        (c) => c.alumnoId === alumnoId && c.tipo === tipo,
      );

      if (existingIndex > -1) {
      // actualizar solo el campo que cambió
        return prevCalificaciones.map((item, index) => (index === existingIndex
          ? { ...item, [fieldToUpdate]: newValue }
          : item));
      }

      // buscar valores iniciales en el alumno si existen
      const alumno = alumnos.find((a) => a.id === alumnoId);
      const califBase = alumno?.calificaciones?.find((c) => c.tipo === tipo);

      return [
        ...prevCalificaciones,
        {
          alumnoId,
          tipo,
          calificacion:
          fieldToUpdate === 'calificacion'
            ? newValue
            : califBase?.calificacion ?? '',
          fechaExamen:
          fieldToUpdate === 'fechaExamen'
            ? newValue
            : califBase?.fechaExamen ?? '',
        },
      ];
    });
  };
  const handleSubmit = async () => {
    const alumnosById = new Map(alumnos.map((a) => [a.id, a]));

    const calificacionesValidas = [];
    const calificacionesInvalidas = [];

    calificaciones.forEach((c) => {
      const alumno = alumnosById.get(c.alumnoId);

      if (alumno) {
        if (alumno.situacionId === 1 && (c.calificacion?.trim() || '') !== '') {
          calificacionesValidas.push(c);
        } else {
          calificacionesInvalidas.push({ ...c, alumno });
        }
      }
    });

    if (calificacionesValidas.length === 0) {
      setNoti({
        open: true,
        message: '¡Calificación inválida, revisa las reglas del programa!',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const calificacionesOrdinarias = calificacionesValidas.filter((c) => c.tipo === 1);
      if (calificacionesOrdinarias.length > 0) {
        await submitCalificaciones(
          calificacionesOrdinarias,
          setNoti,
          grupoId,
          asignaturaId,
          1,
          setResponse,
        );
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al procesar las calificaciones!: ${error.message}`,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (fechaExamenes) {
      setCalificaciones((prevCalificaciones) => prevCalificaciones.map((c) => ({
        ...c,
        fechaExamen: fechaExamenes,
      })));
    }
  }, [fechaExamenes]);

  const columns = columnsInscritosOrdinario(
    disabled,
    updateCalificaciones,
    calificacionMinima,
    calificacionMaxima,
    calificacionDecimal,
    fechaExamenes,
    calificaciones,
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DataTable title={labelAsignatura} rows={alumnos} columns={columns} />
      </Grid>
      <Grid item xs={3}>
        <ButtonSimple
          text="Cancelar"
          design="cancel"
          type="cancel"
          onClick={() => {
            router.back();
          }}
        />
      </Grid>
      {!disabled && (
        <Grid item xs={9}>
          <Button
            text={isSubmitting ? 'Cargando...' : 'Cargar Calificaciones'}
            type="edit"
            align="right"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </Grid>
      )}
      <DefaultModal title="Advertencia" open={open} setOpen={setOpen}>
        Asegúrese de que todos los campos de las reglas de calificación esten llenos.
        <ButtonSimple text="Agregar Reglas" onClick={() => { Router.push(url); }} align="right" />
      </DefaultModal>
    </Grid>
  );
}

Calificaciones.propTypes = {
  disabled: PropTypes.bool.isRequired,
  labelAsignatura: PropTypes.string.isRequired,
  alumnos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      situacionId: PropTypes.number.isRequired,
      situacionValidacionId: PropTypes.number.isRequired,
    }),
  ).isRequired,
  grupoId: PropTypes.number.isRequired,
  asignaturaId: PropTypes.number.isRequired,
  programaId: PropTypes.number.isRequired,
  setAlumnos: PropTypes.func.isRequired,
};
