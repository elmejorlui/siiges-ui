import columnsProgramas from './Tables/programas';
import FormAlumno from './Components/Alumnos/FormAlumno';
import AlumnosForm from './Components/Alumnos/AlumnosForm';
import getGrupoById from './Components/utils/getGrupoById';
import columnsAsignaturas from './Tables/inscripcionesTable';
import AlumnosTable from './Components/Alumnos/AlumnosTable';
import FoliosData from './Components/Folios/FoliosData/index';
import FoliosForm from './Components/Folios/FoliosForm/index';
import FoliosTable from './Components/Folios/FoliosTable/index';
import ProgramasForm from './Components/Programas/ProgramasForm';
import HistorialTable from './Components/Alumnos/HistorialTable';
import ProgramasTable from './Components/Programas/ProgramasTable';
import DatosAlumno from './Components/Validacion/DatosAlumno/index';
import AdminTable from './Components/Folios/FoliosTable/adminTable';
import Grupos from './Components/Programas/ProgramasSections/Grupos';
import Reglas from './Components/Programas/ProgramasSections/Reglas';
import getAsignaturaById from './Components/utils/getAsignaturaById';
import TitulacionTable from './Components/Titulacion/titulacionTable';
import ModalTitulo from './Components/Folios/FoliosData/Modal/titulos';
import ValidacionForm from './Components/Validacion/ValidacionForm/index';
import InscripcionForm from './Components/Inscripciones/InscripcionesForm';
import submitCalificaciones from './Components/utils/submitCalificaciones';
import Calificaciones from './Components/Acreditacion/Calificaciones/index';
import ValidacionTable from './Components/Validacion/ValidacionTable/index';
import ModalAlumnosInscritos from './Components/utils/ModalAlumnosInscritos';
import DatosInstitucion from './Components/Validacion/DatosInstitucion/index';
import ButtonsFoliosAdmin from './Components/Folios/ButtonsFoliosAdmin/index';
import BecasComponents from './Components/BecasServiciosSociales/Becas/index';
import getAlumnosAcreditacion from './Components/utils/getAlumnosAcreditacion';
import Asignaturas from './Components/Programas/ProgramasSections/Asignaturas';
import InscripcionesTable from './Components/Inscripciones/InscripcionesTable';
import DocumentosAlumno from './Components/Alumnos/FormAlumno/DocumentosAlumno';
import ExpedienteAlumno from './Components/Alumnos/FormAlumno/ExpedienteAlumno';
import columnsInstitucionesAutorizadas from './Tables/institucionesAutorizadas';
import RevalidacionEquivalencias from './Components/RevalidacionesEquivalencias';
import ActionsAlumnosInscritos from './Components/utils/ActionsAlumnosInscritos';
import ModalCertificado from './Components/Folios/FoliosData/Modal/certificados';
import FechaExamenInput from './Components/utils/Calificaciones/FechaExamenInput';
import ProgramasData from './Components/Programas/ProgramasSections/ProgramasData';
import CalificacionInput from './Components/utils/Calificaciones/CalificacionInput';
import DetallesAsignatura from './Components/Acreditacion/DetallesAsignatura/index';
import CiclosEscolares from './Components/Programas/ProgramasSections/CiclosEscolares';
import AsignarBecas from './Components/BecasServiciosSociales/Becas/utils/AsignarBecas';
import AcreditacionAsignaturas from './Components/Acreditacion/AcreditacionAsignaturas.jsx';
import ActionsAcreditacionAsignaturas from './Components/utils/ActionsAcreditacionAsignaturas';
import ButtonsInstitucionesAutorizadas from './Components/utils/ButtonsInstitucionesAutorizadas';
import ServicioSocialComponents from './Components/BecasServiciosSociales/ServiciosSociales/index';
import ReporteTable from './Components/Reporte/ReporteTable/index';
import ReporteForm from './Components/Reporte/ReporteForm/index';
import FormAlumnoTitulacion from './Components/Titulacion/FormAlumno/index';
import alumnosService from './Components/utils/alumnosService';
import DocumentosAlumnoTitulacion from './Components/Titulacion/FormAlumno/DocumentoAlumno';
import Titulacion from './Components/Titulacion/FormAlumno/titulacion';
import FormFoliosAsignados from './Components/FoliosAsignados/FormFoliosAsignados';
import TitulosForm from './Components/Titulacion/TitulosForm/index';
import TitulosTable from './Components/Titulacion/catalogoTitulosTable';
import catalogoTitulos from './Tables/catalogoTitulosTable';
import AlumnosData from './Components/Alumnos/AlumnosData';

export {
  ExpedienteAlumno,
  catalogoTitulos,
  TitulosTable,
  TitulosForm,
  Titulacion,
  DocumentosAlumnoTitulacion,
  alumnosService,
  FormAlumnoTitulacion,
  Grupos,
  Reglas,
  AdminTable,
  FormAlumno,
  FoliosData,
  FoliosForm,
  ModalTitulo,
  FoliosTable,
  Asignaturas,
  AlumnosForm,
  DatosAlumno,
  AsignarBecas,
  AlumnosTable,
  getGrupoById,
  ProgramasForm,
  ProgramasData,
  Calificaciones,
  HistorialTable,
  ProgramasTable,
  ValidacionForm,
  InscripcionForm,
  CiclosEscolares,
  ValidacionTable,
  TitulacionTable,
  BecasComponents,
  DatosInstitucion,
  ModalCertificado,
  columnsProgramas,
  DocumentosAlumno,
  FechaExamenInput,
  getAsignaturaById,
  CalificacionInput,
  ButtonsFoliosAdmin,
  columnsAsignaturas,
  InscripcionesTable,
  DetallesAsignatura,
  submitCalificaciones,
  ModalAlumnosInscritos,
  getAlumnosAcreditacion,
  ActionsAlumnosInscritos,
  AcreditacionAsignaturas,
  ServicioSocialComponents,
  RevalidacionEquivalencias,
  ActionsAcreditacionAsignaturas,
  columnsInstitucionesAutorizadas,
  ButtonsInstitucionesAutorizadas,
  ReporteTable,
  ReporteForm,
  FormFoliosAsignados,
  AlumnosData,
};
