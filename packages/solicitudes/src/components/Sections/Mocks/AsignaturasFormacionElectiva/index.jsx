import React from 'react';
import AsignaturasFormacionButtons from '../../../utils/Components/AsignaturasFormacionButtons';

const columns = (isDisabled, type) => [
  { field: 'nombre', headerName: 'Nombre', width: 450 },
  { field: 'clave', headerName: 'Clave', width: 80 },
  { field: 'seriacion', headerName: 'Seriación', width: 300 },
  { field: 'creditos', headerName: 'Créditos', width: 90 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <AsignaturasFormacionButtons
        id={params.id}
        isDisabled={isDisabled}
        type={type}
      />
    ),
    sortable: false,
    filterable: false,
  },
];

export default columns;
