import React from 'react';
import { Typography } from '@mui/material';
import ButtonServicioSocial from '../Components/utils/ButtonServicioSocial';
import DocumentsStudentsServicioSocial from '../Components/utils/DocumentsStudentsServicioSocial';

const OBSERVACIONES_COLOR = '#ed6c02';

const renderColoredCell = (value, hasObservaciones) => (
  <Typography
    variant="body2"
    sx={{ color: hasObservaciones ? OBSERVACIONES_COLOR : 'inherit' }}
  >
    {value}
  </Typography>
);

const columnsServicioSocialAlumnos = (programa, institucion, nivel, onEstatusUpdated) => [
  {
    field: 'id', headerName: 'ID', width: 100, hide: true,
  },
  {
    field: 'matricula',
    headerName: 'Matrícula',
    width: 150,
    renderCell: (params) => renderColoredCell(
      params.row.matricula,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'apellidoPaterno',
    headerName: 'Primer Apellido',
    width: 200,
    renderCell: (params) => renderColoredCell(
      params.row.apellidoPaterno,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'apellidoMaterno',
    headerName: 'Segundo Apellido',
    width: 200,
    renderCell: (params) => renderColoredCell(
      params.row.apellidoMaterno,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 200,
    renderCell: (params) => renderColoredCell(
      params.row.nombre,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'situacion',
    headerName: 'Situación',
    width: 120,
    renderCell: (params) => renderColoredCell(
      params.row.situacion,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'servicioSocial',
    headerName: 'Servicio Social',
    width: 150,
    renderCell: (params) => renderColoredCell(
      params.row.servicioSocial,
      Boolean(params.row.observaciones),
    ),
  },
  {
    field: 'documentos',
    headerName: 'Documentos',
    width: 180,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <DocumentsStudentsServicioSocial
        documentos={params.row.documentosServicioSocial}
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <ButtonServicioSocial
        id={params.id}
        url="/serviciosEscolares/servicioSocial/alumnos"
        programa={programa}
        institucion={institucion}
        nivel={nivel}
        estatusServicioSocialId={params.row.estatusServicioSocialId}
        onUpdated={onEstatusUpdated}
      />
    ),
    sortable: false,
    filterable: false,
  },
];

export default columnsServicioSocialAlumnos;
