import React, { useState, useEffect } from 'react';
import {
  ActionButtons,
  ButtonSimple,
  DataTable,
  DefaultModal,
} from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { getData } from '@siiges-ui/shared/src/utils/handlers/apiUtils';
import deletePlantel from '../../utils/deletePlantel';

function ModalState() {
  const [modal, setModal] = useState(false);
  const [modalId, setModalId] = useState();

  const showModal = (id) => {
    setModalId(id);
    setModal(true);
  };
  const hideModal = () => {
    setModal(false);
  };

  return {
    modal,
    showModal,
    hideModal,
    modalId,
  };
}

async function checkSolicitudes(planteles, session, setNonDeletablePlanteles, setError) {
  try {
    const endpoint = '/solicitudes';
    const query = `?usuarioId=${session.id}&estatusSolicitudId=11`;

    const response = await getData({ endpoint, query });

    if (response.statusCode !== 200) {
      throw new Error(response.errorMessage || '¡Error en la solicitud al servidor!');
    }
    const { data } = response;
    const plantelesConSolicitudes = data.map((solicitud) => solicitud.programa.plantelId);
    const ids = planteles.map(({ id }) => id);
    const nonDeletable = ids.filter((id) => plantelesConSolicitudes.includes(id));
    setNonDeletablePlanteles(nonDeletable);
  } catch (errorSolicitud) {
    setError('¡Error en la solicitud!:', errorSolicitud.message);
  }
}

export default function Planteles({ planteles, institucionId, session }) {
  const [setError] = useState('');
  const [nonDeletablePlanteles, setNonDeletablePlanteles] = useState([]);
  useEffect(() => {
    checkSolicitudes(planteles, session, setNonDeletablePlanteles, setError);
  }, [planteles, session]);

  const router = useRouter();
  const {
    modal, showModal, hideModal, modalId,
  } = ModalState();

  const [rows, setRows] = useState(
    planteles.map((value) => ({
      institucionId,
      id: value.id,
      domicilio: `${value.domicilio.calle} #${value.domicilio.numeroExterior}`,
      colonia: value.domicilio.colonia,
      municipio: value.domicilio.municipio.nombre,
      codigoPostal: value.domicilio.codigoPostal,
      claveCentroTrabajo: value.claveCentroTrabajo,
    })),
  );

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { field: 'domicilio', headerName: 'Domicilio', width: 240 },
    { field: 'colonia', headerName: 'Colonia', width: 240 },
    { field: 'municipio', headerName: 'Municipio', width: 140 },
    { field: 'codigoPostal', headerName: 'Código Postal', width: 130 },
    {
      field: 'claveCentroTrabajo',
      headerName: 'Clave centro de trabajo',
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => {
        const actionButtonsProps = {
          id: params.id,
          consultar: `/instituciones/${institucionId}/planteles/consultar/${params.id}`,
        };

        if (!params.row.claveCentroTrabajo && session.rol !== 'gestor') {
          actionButtonsProps.editar = `/instituciones/${institucionId}/planteles/editar/${params.id}`;
        }

        if (!nonDeletablePlanteles.includes(params.id) && session.rol === 'representante') {
          actionButtonsProps.eliminar = () => showModal(params.id);
          actionButtonsProps.editar = `/instituciones/${institucionId}/planteles/editar/${params.id}`;
        }

        return (
          <>
            <ActionButtons
              id={actionButtonsProps.id}
              nonDeletablePlanteles={nonDeletablePlanteles}
              consultar={actionButtonsProps.consultar}
              editar={actionButtonsProps.editar}
              eliminar={actionButtonsProps.eliminar}
            />
            <DefaultModal open={modal} setOpen={hideModal} id={modalId} title="Eliminar Plantel">
              <Typography>¿Desea eliminar este plantel?</Typography>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <ButtonSimple
                    text="Cancelar"
                    design="cancel"
                    onClick={hideModal}
                  />
                </Grid>
                <Grid item>
                  <ButtonSimple
                    text="Confirmar"
                    onClick={() => {
                      hideModal();
                      deletePlantel(
                        institucionId,
                        modalId,
                        handleDeleteClick,
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </DefaultModal>
          </>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Grid container>
      <DataTable
        rows={rows}
        columns={columns}
        title="Planteles"
        buttonAdd
        buttonText="Agregar Plantel"
        buttonType="add"
        buttonClick={() => {
          router.push(`/instituciones/${institucionId}/planteles/crear`);
        }}
      />
    </Grid>
  );
}

Planteles.propTypes = {
  institucionId: PropTypes.number.isRequired,
  planteles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      claveCentroTrabajo: PropTypes.string,
      domicilio: PropTypes.shape({
        id: PropTypes.number,
        calle: PropTypes.string,
        numeroExterior: PropTypes.string,
        colonia: PropTypes.string,
        codigoPostal: PropTypes.number,
        municipio: PropTypes.shape({
          id: PropTypes.number,
          nombre: PropTypes.string,
        }),
      }),
    }),
  ).isRequired,
  session: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
};
