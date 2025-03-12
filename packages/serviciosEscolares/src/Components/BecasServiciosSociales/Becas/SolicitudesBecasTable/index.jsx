import React, { useState, useEffect, useContext } from 'react';
import { Context, DataTable } from '@siiges-ui/shared';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  handleCreateClick, fetchSolicitudesData,
} from '../utils';
import SolicitudesBecasTableButtons from '../utils/SolicitudesBecasTableButtons';

export default function SolicitudesBecasTable({ programa, institucion }) {
  const {
    loading, setLoading, setNoti, session,
  } = useContext(Context);
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchSolicitudesData(setNoti, setLoading, (fetchedData) => {
      setData(fetchedData);

      if (session.rol === 'becas_sicyt') {
        const filtered = fetchedData.filter(
          (item) => item.estatusSolicitudBecaId === 'EN REVISION',
        );
        setData(filtered);
      } else {
        setData(fetchedData);
      }
    });
  }, [session.rol]);

  const columns = [
    { field: 'folioSolicitud', headerName: 'Folio de solicitud', width: 200 },
    { field: 'programaId', headerName: 'Programa', width: 250 },
    { field: 'cicloEscolarId', headerName: 'Ciclo Escolar', width: 100 },
    { field: 'estatusSolicitudBecaId', headerName: 'Estatus', width: 150 },
    { field: 'createdAt', headerName: 'Fecha de solicitud', width: 200 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <SolicitudesBecasTableButtons
          id={params.row.id}
          programa={programa}
          institucion={institucion}
          estatusSolicitudBecaId={params.row.estatusSolicitudBecaId}
          router={router}
        />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Lista de solicitudes"
        rows={data || []}
        columns={columns}
        loading={loading}
        buttonAdd
        buttonText="Agregar Solicitud"
        buttonClick={() => handleCreateClick({ programa, institucion }, router)}
      />
    </div>
  );
}

SolicitudesBecasTable.propTypes = {
  programa: PropTypes.number.isRequired,
  institucion: PropTypes.number.isRequired,
};
