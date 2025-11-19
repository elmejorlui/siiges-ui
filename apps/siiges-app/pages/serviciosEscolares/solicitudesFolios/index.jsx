import { AdminTable, FoliosForm, FoliosTable } from '@siiges-ui/serviciosescolares';
import { Context, getData, Layout } from '@siiges-ui/shared';
import React, { useState, useContext, useEffect } from 'react';

export default function SolicitudesFolios() {
  const { setLoading, setNoti, session } = useContext(Context);

  const [tipoSolicitud, setTipoSolicitud] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState(null);
  const [estatus, setEstatus] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [programa, setPrograma] = useState(null);
  const [plantel, setPlantel] = useState(null);
  const [institucion, setInstitucion] = useState(null);

  const isAdmin = session.rol === 'admin';
  const isRepresentante = session.rol === 'representante';
  const isCeIes = session.rol === 'ce_ies';
  const isCeSicyt = session.rol === 'ce_sicyt';

  const estatusMap = {
    1: [1],
    2: [2],
    3: [3],
    4: [4],
    5: [5],
  };

  const buildEndpoint = () => {
    const params = new URLSearchParams();
    if (institucion) params.append('institucionId', institucion);
    if (plantel) params.append('plantelId', plantel);
    if (programa) params.append('programaId', programa);
    if (tipoDocumento) params.append('tipoDocumentoId', tipoDocumento);
    if (tipoSolicitud) params.append('tipoSolicitudFolioId', tipoSolicitud);

    if (estatus.length > 0) {
      const mapped = estatus.flatMap((id) => estatusMap[id] || []);
      if (mapped.length > 0) params.append('estatus', mapped.join(','));
    }

    return `/solicitudesFolios?${params.toString()}`;
  };

  const fetchData = async () => {
    if (!institucion && !plantel && !isAdmin && !isCeSicyt) return;

    try {
      setLoading(true);
      const endpoint = buildEndpoint();
      const response = await getData({ endpoint });
      if (response.statusCode === 200) {
        setSolicitudes(response.data);
      } else {
        setNoti({
          open: true,
          message: response.message || 'Error al cargar datos',
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: 'Error al obtener datos, revise los filtros',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isCeSicyt) {
      setEstatus([2]);
      fetchData();
    }
  }, [isAdmin, isCeSicyt]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    if (institucion || plantel || programa || tipoDocumento || tipoSolicitud || estatus.length > 0) {
      fetchData();
    } else {
      setSolicitudes([]);
    }
  }, [institucion, plantel, programa, tipoDocumento, tipoSolicitud, estatus]);

  const renderTable = () => {
    if (isAdmin || isCeSicyt) {
      return (
        <AdminTable
          solicitudes={solicitudes}
          isAdmin={isAdmin}
          isCeSicyt={isCeSicyt}
        />
      );
    }

    if (isRepresentante || isCeIes) {
      return (
        <FoliosTable
          tipoDocumento={tipoDocumento}
          tipoSolicitud={tipoSolicitud}
          programa={programa}
          plantel={plantel}
          institucion={institucion}
          solicitudes={solicitudes}
        />
      );
    }
    return null;
  };

  return (
    <Layout title="Solicitudes de Folios">
      <FoliosForm
        setTipoSolicitud={setTipoSolicitud}
        setTipoDocumento={setTipoDocumento}
        setEstatus={setEstatus}
        estatus={estatus}
        setPrograma={setPrograma}
        setPlantel={setPlantel}
        setInstitucion={setInstitucion}
        setLoading={setLoading}
      />
      {renderTable()}
    </Layout>
  );
}
