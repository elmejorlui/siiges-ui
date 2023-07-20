import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import SolicitudContext from './solicitudContext';

export const TablesPlanEstudiosContext = createContext();

export function TablesPlanEstudiosProvider({ children }) {
  const { id, setNoti, programaId } = useContext(SolicitudContext);
  const [formAsignaturas, setFormAsignaturas] = useState({ tipo: 1 });
  const [formAsignaturasFormacion, setFormAsignaturasFormacion] = useState({
    tipo: 2,
  });
  const [formDocentes, setFormDocentes] = useState({
    esAceptado: true,
    persona: {},
    asignaturasDocentes: [],
  });
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [asignaturasFormacionList, setAsignaturasFormacionList] = useState([]);
  const [docentesList, setDocentesList] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [error, setError] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      setFormAsignaturas((prevForm) => ({
        ...prevForm,
        programaId,
      }));
      setFormAsignaturasFormacion((prevForm) => ({
        ...prevForm,
        programaId,
      }));
      setFormDocentes((prevForm) => ({
        ...prevForm,
        programaId,
      }));
    }
  }, [id]);

  const contextValue = useMemo(
    () => ({
      asignaturasList,
      setAsignaturasList,
      docentesList,
      setDocentesList,
      asignaturasFormacionList,
      setAsignaturasFormacionList,
      initialValues,
      setInitialValues,
      error,
      setError,
      errors,
      setErrors,
      formAsignaturas,
      setFormAsignaturas,
      formAsignaturasFormacion,
      setFormAsignaturasFormacion,
      formDocentes,
      setFormDocentes,
      id,
      setNoti,
      programaId,
    }),
    [
      asignaturasList,
      setAsignaturasList,
      asignaturasFormacionList,
      setAsignaturasFormacionList,
      initialValues,
      setInitialValues,
      error,
      setError,
      errors,
      setErrors,
      formAsignaturas,
      setFormAsignaturas,
      formAsignaturasFormacion,
      setFormAsignaturasFormacion,
      formDocentes,
      setFormDocentes,
      id,
      setNoti,
      programaId,
    ],
  );

  return (
    <TablesPlanEstudiosContext.Provider value={contextValue}>
      {children}
    </TablesPlanEstudiosContext.Provider>
  );
}

TablesPlanEstudiosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
