import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AlertCustom from "../../common/AlertCustom";

import { deletePatientRequest } from "../../api/api";
import { usePatients } from "../../hooks/usePatients";
import Pagination from "../../common/Pagination";
import EditPacienteDialog from "./custom/EditPacienteDialog";
import { useAuth } from "../../context/AuthContext";

const Patients = () => {
  const { user } = useAuth();

  const {
    pacientesToDisplay,
    loading,
    setLoading,
    next,
    prev,
    currentPage,
    pageCount,
    getItemProps,
  } = usePatients();

  const [alertConfig, setAlertConfig] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [editingPatient, setEditingPatient] = useState({});

  const onDeletePatient = async (idUser) => {
    setLoading(true);
    try {
      await deletePatientRequest(idUser, user.token);
      setAlertConfig({
        msg: "Paciente eliminado",
        type: "success",
        isopen: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner className="h-8 w-8 mx-auto mt-[25%]" />
      ) : (
        <>
          <AlertCustom
            msg={alertConfig.msg}
            type={alertConfig.type}
            isopen={alertConfig.isopen}
          />
          <div className="flex flex-wrap gap-y-10">
            {pacientesToDisplay.map(({ Correo, Paciente }, key) => (
              <Card key={key} className="w-full max-w-[45%] mx-auto px-10 py-5">
                <CardHeader
                  color="transparent"
                  floated={false}
                  shadow={false}
                  className="mx-0 flex items-center gap-4 pt-0 pb-8"
                >
                  <Avatar
                    size="xxl"
                    variant="rounded"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  />
                  <div className="flex w-full flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="h5" color="blue-gray">
                          {Paciente.Nombre} {Paciente.ApellidoP}{" "}
                          {Paciente.ApellidoM}
                        </Typography>
                        <Typography color="blue-gray">
                          {Paciente.Edad} años {Paciente.Correo}
                        </Typography>
                      </div>
                      <div className="flex flex-col gap-y-3">
                        <IconButton
                          onClick={() => {
                            setOpenEdit(true);
                            setEditingPatient({ ...Paciente, Correo });
                          }}
                        >
                          <AiFillEdit className="w-6 h-6" />
                        </IconButton>
                        <IconButton
                          color="red"
                          onClick={() => onDeletePatient(Paciente.idUser)}
                        >
                          <AiFillDelete className="w-6 h-6" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="mb-6 p-0">
                  <Typography>{Paciente.Domicilio}</Typography>
                </CardBody>
              </Card>
            ))}
          </div>

          <Pagination
            prev={prev}
            currentPage={currentPage}
            pageCount={pageCount}
            next={next}
            getItemProps={getItemProps}
          />

          <EditPacienteDialog
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            editingPatient={editingPatient}
            setEditingPatient={setEditingPatient}
            setAlertConfig={setAlertConfig}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  );
};

export default Patients;