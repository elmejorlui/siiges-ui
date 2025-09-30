import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  NewRequest,
  ChangeAddress,
  Refrendo,
  getSolicitudes,
  columnsSolicitudes,
} from '@siiges-ui/solicitudes';
import {
  Layout, Select, DataTable, Context,
} from '@siiges-ui/shared';
import { Divider } from '@mui/material';

export default function Solicitudes() {
  const { session } = useContext(Context);
  const [newSolicitud, setNewSolicitud] = useState(false);
  const [option, setOption] = useState();
  const [NewRequestContentVisible, setNewRequestContentVisible] = useState(false);
  const [ChangeAddressContentVisible, setChangeAddressContentVisible] = useState(false);
  const [RefrendoContentVisible, setRefrendoContentVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const { solicitudes } = getSolicitudes();
  useEffect(() => {
    if (solicitudes !== undefined && solicitudes !== null) {
      let filteredSolicitudes;

      if (session.rol === 'control_documental') {
        filteredSolicitudes = solicitudes.filter(
          (solicitud) => [2, 3].includes(solicitud.estatusSolicitudId),
        );
      } else {
        filteredSolicitudes = solicitudes;
      }
      const formattedRows = filteredSolicitudes.map((solicitud) => ({
        id: solicitud.id,
        estatus: solicitud.estatusSolicitudId,
        folio: solicitud.folio,
        tipoSolicitud: solicitud.tipoSolicitud?.nombre,
        programa: solicitud.programa?.nombre,
        acuerdoRvoe: solicitud.programa?.acuerdoRvoe,
        estatusSolicitudId: solicitud.estatusSolicitud?.nombre,
        institucion: solicitud?.programa?.plantel?.institucion?.nombre,
        plantel: `${solicitud.programa?.plantel?.domicilio?.calle} #${solicitud.programa?.plantel?.domicilio?.numeroExterior}`,
        actions: 'Actions Placeholder',
      }));

      setRows(formattedRows);
    }
  }, [solicitudes, session.rol]);

  useEffect(() => {
    if (session.rol === 'representante') {
      setNewSolicitud(true);
    }
  }, [session]);

  useEffect(() => {
    setNewRequestContentVisible(option === 'new');
    setChangeAddressContentVisible(option === 'address');
    setRefrendoContentVisible(option === 'refrendo');
  }, [option]);

  const handleOnChange = (e) => {
    setOption(e.target.value);
  };

  const hasAcuerdoRvoe = useMemo(() => solicitudes?.some(
    (s) => s.programa?.acuerdoRvoe && s.programa.acuerdoRvoe.trim() !== '',
  ), [solicitudes]);

  const options = useMemo(() => {
    const baseOptions = [
      { id: 'new', nombre: 'Nueva Solicitud' },
    ];
    if (hasAcuerdoRvoe) {
      baseOptions.push(
        { id: 'refrendo', nombre: 'Refrendo de plan de estudios' },
        { id: 'address', nombre: 'Cambio de domicilio' },
      );
    }
    return baseOptions;
  }, [hasAcuerdoRvoe]);

  return (
    <Layout title="Solicitudes">
      {newSolicitud && (
        <Select
          title="Seleccione una opción"
          name="options"
          options={options}
          value=""
          onChange={handleOnChange}
        />
      )}
      <Divider sx={{ mt: 2 }} />
      {NewRequestContentVisible && <NewRequest />}
      {ChangeAddressContentVisible && <ChangeAddress />}
      {RefrendoContentVisible && <Refrendo />}
      <DataTable
        title="Tabla de solicitudes"
        rows={rows}
        columns={columnsSolicitudes(session.rol)}
      />
    </Layout>
  );
}
