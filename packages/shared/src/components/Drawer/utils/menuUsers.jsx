import React from 'react';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

const options = [
  {
    id: 1,
    nombre: 'Incorporación',
    roles: ['admin', 'representante', 'sicyt_editar'],
  },
  {
    id: 2,
    nombre: 'Servicios escolares',
    roles: ['admin', 'representante', 'ce_ies', 'ce_sicyt'],
  },
  // { id: 3, nombre: "OPD'S", roles: ['admin', 'ce_sicyt'] },
  {
    id: 4,
    nombre: 'App de Titulación Electrónica',
    roles: ['representante', 'ce_ies'],
    externalLink: 'https://tituloelectronico.jalisco.gob.mx/ies/login.jsp',
  },
];

const usersAdmin = ['admin', 'sicyt_editar'];
const isAdminRolValidate = (rol) => usersAdmin.includes(rol);

const routeInstitucionesRol = (rol) => (isAdminRolValidate(rol) ? '/instituciones' : '/instituciones/miInstitucion');

const textPanelMenuOptions = (rol) => {
  const isAdmin = isAdminRolValidate(rol);
  const textMenu = {
    usuarios: isAdmin ? 'Usuarios' : 'Mis usuarios',
    instituciones: isAdmin ? 'Instituciones' : 'Mi institución',
    solicitudes: isAdmin ? 'Solicitudes' : 'Mis solicitudes',
  };
  return textMenu;
};

const solicitudesMenu = (rol) => ({
  userId: 1,
  text: textPanelMenuOptions(rol).solicitudes,
  icon: <DescriptionIcon />,
  route: '/solicitudes',
  key: 'solicitudes',
});

const panelMenuOptions = (rol) => [
  ...(rol !== 'sicyt_editar' ? [{
    userId: 1,
    text: textPanelMenuOptions(rol).usuarios,
    icon: <GroupIcon />,
    route: '/usuarios',
    key: 'users',
  }] : []),
  {
    userId: 1,
    text: textPanelMenuOptions(rol).instituciones,
    icon: <BusinessIcon />,
    route: routeInstitucionesRol(rol),
    key: 'intitutions',
  },
  solicitudesMenu(rol),
  {
    userId: 2,
    text: 'Programas',
    icon: <AssignmentIcon />,
    route: '/serviciosEscolares/programas',
    key: 'programas',
  },
  {
    userId: 2,
    text: 'Alumnos',
    icon: <PersonIcon />,
    route: '/serviciosEscolares/alumnos',
    key: 'alumnos',
  },
  {
    userId: 2,
    text: 'Validación',
    icon: <AssignmentTurnedInIcon />,
    route: '/serviciosEscolares/validacion',
    key: 'validacion',
  },
  {
    userId: 2,
    text: 'Inscripción',
    icon: <PersonAddIcon />,
    route: '/serviciosEscolares/inscripcion',
    key: 'inscripcion',
  },
  {
    userId: 2,
    text: 'Acreditación',
    icon: <HistoryEduIcon />,
    route: '/serviciosEscolares/acreditacion',
    key: 'acreditacion',
  },
  {
    userId: 2,
    text: 'Titulación',
    icon: <SchoolIcon />,
    type: 'dropdown',
    options: [
      {
        text: 'Egresados',
        route: '/serviciosEscolares/egresados',
      },
      {
        text: 'Catálogo de Títulos Electrónicos',
        route: '/serviciosEscolares/titulacion',
      },
    ],
    key: 'titulacion',
  },
  /* {
    userId: 2,
    text: 'Otros Trámites',
    icon: <MoreHorizIcon />,
    type: 'dropdown',
    options: [
      {
        text: 'Revalidación y Equivalencias',
        route: '/serviciosEscolares/revalidacionEquivalencias',
      },
      {
        text: 'Becas',
        route: '/solicitudesBecas',
      },
      {
        text: 'Servicio Social',
        route: '/serviciosEscolares/servicioSocial',
      },
      {
        text: 'Solicitud de Folios',
        route: '/serviciosEscolares/solicitudesFolios',
      },
    ],
    key: 'otrosTramites',
  }, */
  ...(rol !== 'ce_ies' ? [{
    userId: 2,
    text: 'Reportes',
    icon: <AssignmentLateIcon />,
    type: 'dropdown',
    options: [
      { text: 'Extraordinarios', route: '/serviciosEscolares/reporte/extraordinario' },
      { text: 'Folios Asignados', route: '/serviciosEscolares/reporte/foliosAsignados' },
    ],
    key: 'reporte',
  }] : []),
  {
    userId: 3,
    text: 'Instituciones',
    icon: <BusinessIcon />,
    route: '/opds/instituciones',
    key: 'intitutions',
  },
  {
    userId: 3,
    text: 'Órganos colegiados',
    icon: <GroupsIcon />,
    route: '/opds/organosColegiados',
    key: 'organosColegiados',
  },
  {
    userId: 3,
    text: 'Fortalecimiento',
    icon: <ArticleIcon />,
    route: '/opds/fortalecimiento',
    key: 'fortalecimeiento',
  },
  {
    userId: 3,
    text: 'Presupuesto',
    icon: <RequestQuoteIcon />,
    route: '/opds/presupuesto',
    key: 'presupuesto',
  },
];

const optionsMenuFilter = {
  jefe_inspector: [
    {
      text: 'Asignación de Inspecciones',
      icon: <SearchIcon />,
      route: '/inspecciones',
      key: 'inspecciones',
    },
  ],
  inspector: [
    {
      text: 'Inspección',
      icon: <SearchIcon />,
      route: '/inspecciones/misInspecciones',
      key: 'inspecciones',
    },
  ],
  gestor: [
    solicitudesMenu('gestor'),
    {
      userId: 1,
      text: textPanelMenuOptions('gestor').instituciones,
      icon: <BusinessIcon />,
      route: routeInstitucionesRol('gestor'),
      key: 'intitutions',
    },
  ],
  capturista_opd: [
    {
      text: 'Instituciones',
      icon: <BusinessIcon />,
      route: '/opds/instituciones',
      key: 'intitutions',
    },
    {
      text: 'Órganos colegiados',
      icon: <GroupsIcon />,
      route: '/opds/organosColegiados',
      key: 'organosColegiados',
    },
    {
      text: 'Fortalecimiento',
      icon: <ArticleIcon />,
      route: '/opds/fortalecimiento',
      key: 'fortalecimeiento',
    },
    {
      text: 'Presupuesto',
      icon: <RequestQuoteIcon />,
      route: '/opds/presupuesto',
      key: 'presupuesto',
    },
  ],
  control_documental: [
    {
      text: 'Mis solicitudes',
      icon: <DescriptionIcon />,
      route: '/solicitudes',
      key: 'solicitudes',
    },
  ],
  becas_ies: [
    {
      text: 'Becas académicas',
      icon: <DescriptionIcon />,
      route: '/solicitudesBecas',
      key: 'solicitudesBecas',
    },
  ],
  becas_sicyt: [
    {
      text: 'Becas académicas',
      icon: <DescriptionIcon />,
      route: '/solicitudesBecas',
      key: 'solicitudesBecas',
    },
  ],
  serv_soc_ies: [
    {
      text: 'Servicio Social',
      icon: <DescriptionIcon />,
      route: '/serviciosEscolares/servicioSocial',
      key: 'servicioSocial',
    },
  ],
  serv_soc_sicyt: [
    {
      text: 'Servicio Social',
      icon: <DescriptionIcon />,
      route: '/serviciosEscolares/servicioSocial',
      key: 'servicioSocial',
    },
  ],
  equiv_sicyt: [
    {
      text: 'Revalidación y Equivalencias',
      icon: <DescriptionIcon />,
      route: '/serviciosEscolares/revalidacionEquivalencias',
      key: 'revalidacionEquivalencias',
    },
  ],
};

const getOptionsRoles = (rol) => options.filter(({ roles }) => roles.includes(rol));

const optionsAdminMenuFilterRol = (rol) => {
  const user = getOptionsRoles(rol);
  const usersMenu = panelMenuOptions(rol);
  const optionsMultiplerMenuFilter = user
    .map(({ id }) => usersMenu.filter(({ userId }) => userId === id));
  return optionsMultiplerMenuFilter;
};

/**
 * Finds the userId associated with a given path.
 *
 * @param {string} path - The path to search for.
 * @returns {number} - The userId associated with the path.
 */
const findRoute = (path, rol) => {
  const wordSearch = path.split('/')[1];
  const usersMenu = panelMenuOptions(rol);
  let foundItem = usersMenu.find(
    ({ route }) => route && route.startsWith(`/${wordSearch}`),
  );
  if (!foundItem && usersMenu.length) {
    foundItem = optionsAdminMenuFilterRol(rol).flat()[0]?.userId;
  }
  if (foundItem?.userId) {
    foundItem = foundItem?.userId;
  }
  return foundItem;
};

export {
  findRoute,
  optionsMenuFilter,
  optionsAdminMenuFilterRol,
  getOptionsRoles,
};
