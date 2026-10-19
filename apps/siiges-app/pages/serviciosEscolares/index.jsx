import React, { useState } from 'react';
import { Layout, DataTable } from '@siiges-ui/shared';
import { Grid } from '@mui/material';
import { getInstituciones } from '@siiges-ui/instituciones';
import columns from '@siiges-ui/serviciosescolares/src/Tables/institucionesAutorizadas';

export default function ServiciosEscolares() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortModel, setSortModel] = useState([{ field: 'nombre', sort: 'asc' }]);
  const activeSort = sortModel[0] || { field: 'nombre', sort: 'asc' };

  const { instituciones, pagination } = getInstituciones({
    esNombreAutorizado: true,
    setLoading,
    tipoInstitucionId: 1,
    page,
    limit: pageSize,
    search,
    sortBy: activeSort.field,
    sortOrder: activeSort.sort,
  });

  return (
    <Layout
      title="Instituciones"
      subtitle="Consulta todas las instituciones registradas"
      loading={loading}
    >
      <Grid container>
        <DataTable
          rows={instituciones}
          columns={columns}
          title="Tabla de instituciones"
          loading={loading}
          paginationMode="server"
          rowCount={pagination.total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPage(0);
            setPageSize(nextPageSize);
          }}
          sortModel={sortModel}
          onSortModelChange={(nextSortModel) => {
            setPage(0);
            setSortModel(nextSortModel);
          }}
          onSearch={(nextSearch) => {
            setPage(0);
            setSearch(nextSearch);
          }}
        />
      </Grid>
    </Layout>
  );
}
