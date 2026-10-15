import InstitucionBox from './components/Instituciones/InstitucionBox';
import InstitucionView from './components/Instituciones/InstitucionView';
import InstitucionesTable from './components/Instituciones/InstitucionesTable';
import InstitucionesSkeleton from './components/Instituciones/InstitucionesSkeleton';
import InstitucionForm from './components/Instituciones/InstitucionForm';
import EditInstitutionForm from './components/Instituciones/editInstitutionForm';
import PlantelNewForm from './components/Planteles/PlantelNewForm';
import PlantelEditForm from './components/Planteles/PlantelEditForm';
import PlantelView from './components/Planteles/PlantelView';
import PlantelesTable from './components/Planteles/PlantelesTable';
import getInstitucionUsuario from './components/utils/getInstitucionUsuario';
import getPlanteles from './components/utils/getPlanteles';
import getPlantelesByInstitucion from './utils/getPlantelesByInstitucion';
import getInstitucionHook from './utils/getInstitucionHook';
import getInstituciones from './utils/getInstituciones';
import getInstitucionesOpciones from './utils/getInstitucionesOpciones';
import getProgramas from './utils/getProgramas';
import getGrados from './utils/getGrados';
import getCiclosEscolares from './utils/getCiclosEscolares';
import getGrupos from './utils/getGrupos';
import getAlumnoByMatricula from './utils/getAlumnoByMatricula';
import PlantelesInstitucionesAuth from './components/Planteles/plantelesInstitucionesAuth';
import postAsignaturasAlumno from './utils/postAsignaturasAlumno';
import getInscripcionesAlumnos from './utils/getInscripcionesAlumnos';
import getInstitucionProgramas from './utils/getInstitucionProgramas';
import groupProgramasByPlantel from './utils/groupProgramasByPlantel';

export {
  InstitucionBox,
  InstitucionView,
  InstitucionesTable,
  InstitucionesSkeleton,
  InstitucionForm,
  EditInstitutionForm,
  PlantelNewForm,
  PlantelEditForm,
  PlantelView,
  PlantelesTable,
  getInstitucionUsuario,
  getPlanteles,
  getProgramas,
  getInstitucionHook,
  getInstituciones,
  getInstitucionesOpciones,
  PlantelesInstitucionesAuth,
  getPlantelesByInstitucion,
  getGrados,
  getCiclosEscolares,
  getGrupos,
  getAlumnoByMatricula,
  postAsignaturasAlumno,
  getInscripcionesAlumnos,
  getInstitucionProgramas,
  groupProgramasByPlantel,
};
