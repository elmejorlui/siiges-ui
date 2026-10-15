import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropTypes from 'prop-types';

const mockGetInstituciones = jest.fn();

function MockDataTable({
  rows, paginationMode, rowCount, page, pageSize,
}) {
  return (
    <div
      data-testid="instituciones-table"
      data-rows={rows.length}
      data-pagination-mode={paginationMode}
      data-row-count={rowCount}
      data-page={page}
      data-page-size={pageSize}
    />
  );
}

MockDataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  paginationMode: PropTypes.string,
  rowCount: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
};

MockDataTable.defaultProps = {
  paginationMode: 'client',
  rowCount: 0,
  page: 0,
  pageSize: 10,
};

function MockLayout({ children }) {
  return <div>{children}</div>;
}

MockLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

function MockDataTableWrapper({
  rows, paginationMode, rowCount, page, pageSize,
}) {
  return (
    <MockDataTable
      rows={rows}
      paginationMode={paginationMode}
      rowCount={rowCount}
      page={page}
      pageSize={pageSize}
    />
  );
}

MockDataTableWrapper.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  paginationMode: PropTypes.string,
  rowCount: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
};

MockDataTableWrapper.defaultProps = {
  paginationMode: 'client',
  rowCount: 0,
  page: 0,
  pageSize: 10,
};

jest.mock('@siiges-ui/shared', () => ({
  Layout: MockLayout,
  DataTable: MockDataTableWrapper,
}));

jest.mock('@siiges-ui/instituciones', () => ({
  getInstituciones: (...args) => mockGetInstituciones(...args),
}));

const ServiciosEscolaresPage = require('../pages/serviciosEscolares/index').default;

describe('ServiciosEscolaresPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInstituciones.mockReturnValue({
      instituciones: [{ id: 1 }],
      pagination: { total: 42 },
    });
  });

  it('uses server-side pagination for the authorized institutions table', () => {
    render(<ServiciosEscolaresPage />);

    expect(mockGetInstituciones).toHaveBeenCalledWith(expect.objectContaining({
      esNombreAutorizado: true,
      tipoInstitucionId: 1,
      page: 0,
      limit: 10,
      search: '',
      sortBy: 'nombre',
      sortOrder: 'asc',
    }));
    expect(screen.getByTestId('instituciones-table')).toHaveAttribute('data-pagination-mode', 'server');
    expect(screen.getByTestId('instituciones-table')).toHaveAttribute('data-row-count', '42');
    expect(screen.getByTestId('instituciones-table')).toHaveAttribute('data-rows', '1');
  });
});
