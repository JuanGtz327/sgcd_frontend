import {
  Alert,
  Button,
  Checkbox,
  Option,
  Select,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { createElement, useEffect, useState } from "react";
import Loader from "../../common/Loader";
import {
  ClipboardDocumentListIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import { useDoctors } from "../../hooks/useDoctors";
import DatosDoctorEdit from "../doctor/datos_doctor/DatosDoctorEdit";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { editDoctorConfigsRequest } from "../../api/api";
import { IoIosWarning } from "react-icons/io";
import { BreadCrumbsPag } from "../../common/BreadCrumbsPag";

const horarios = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const data = [
  {
    label: "Datos Personales",
    value: "datos_personales",
    icon: ClipboardDocumentListIcon,
    id: 0,
  },
  {
    label: "Configuraciones",
    value: "configuraciones",
    icon: FingerPrintIcon,
    id: 1,
  },
];

const DoctorAdministration = () => {
  const { doctorID } = useParams();
  const [doctor, setDoctor] = useState(null);
  const { getDoctor } = useDoctors(null, doctorID);
  const [loading, setLoading] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [configuraciones, setConfiguraciones] = useState({});

  const { control } = useForm();

  useEffect(() => {
    (async () => {
      const res = await getDoctor(doctorID);
      setDoctor(res);
      setConfiguraciones({
        ...res.Configuracione,
        Dias_laborables: res.Configuracione.Dias_laborables?.includes(",")
          ? res.Configuracione.Dias_laborables.split(",")
          : [res.Configuracione.Dias_laborables],
      });
    })();
    setLoading(false);
  }, [doctorID]);

  const onLaborableDay = (day, checked) => {
    if (!checked) {
      if (configuraciones.Dias_laborables.length == 1) {
        showToast("error", "Debe seleccionar al menos un día laborable");
        return;
      }

      setConfiguraciones({
        ...configuraciones,
        Dias_laborables: configuraciones.Dias_laborables.filter(
          (dia) => dia !== day
        ),
      });
    } else {
      setConfiguraciones({
        ...configuraciones,
        Dias_laborables: [...configuraciones.Dias_laborables, day],
      });
    }
  };

  return (
    <>
      {!loading && doctor ? (
        <div className="py-5 px-1 md:py-4 2xl:px-16">
          <BreadCrumbsPag show={[6, 7, 8]} idDoctor={doctorID} />
          <div className="mt-5 md:mt-0 flex w-full lg:mb-5 justify-end">
            <div className="w-full text-center">
              <Typography variant="h3" color="gray" className="md:text-right">
                {doctor.Genero === "F" ? "Dra. " : "Dr. "} {doctor.Nombre}{" "}
                {doctor.ApellidoP} {doctor.ApellidoM}
              </Typography>
              <div className="flex my-2 md:mt-6 justify-center">
                <div className="w-full h-1 rounded-full bg-indigo-500 inline-flex"></div>
              </div>
            </div>
          </div>
          <Tabs value="dashboard" className="shadow-none md:shadow-2xl">
            <TabsHeader>
              {data.map(({ label, value, icon }) => (
                <Tab key={value} value={value}>
                  <div className="md:flex md:items-center md:gap-2 md:text-base text-sm">
                    {createElement(icon, { className: "w-5 h-5 mx-auto" })}
                    {label}
                  </div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody className="bg-white shadow-none md:shadow-2xl rounded-sm mt-5 md:mt-10 2xl:min-h-[650px]">
              <TabPanel value="dashboard">
                <div className="text-center py-24">
                  <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
                    Administración del doctor
                  </h1>
                  <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">
                    En este apartado puede editar los datos del doctor, como lo
                    son su perfil y sus preferencias de trabajo.
                  </p>
                  <div className="flex mt-6 justify-center">
                    <div className="w-64 h-1 rounded-full bg-indigo-500 inline-flex"></div>
                  </div>
                </div>
              </TabPanel>

              {data.map(({ value, id }) => (
                <TabPanel key={value} value={value}>
                  {id == 0 && (
                    <div className="flex flex-col h-full md:px-5 2xl:px-16 mt-4">
                      <DatosDoctorEdit doctor={doctor} doctorID={doctorID} />
                    </div>
                  )}
                  {id == 1 && (
                    <div className="flex flex-col h-full md:px-5 2xl:px-16">
                      <form className="mt-4 mb-2 w-[100%]">
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Configuraciones
                              </h2>
                              <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
                                En este apartado puede editar las
                                configuraciones del doctor.
                              </p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between md:justify-start md:gap-5">
                              {!loadingConfig ? (
                                <>
                                  <Link
                                    to={`${
                                      import.meta.env.VITE_FRONTEND_URL ||
                                      "http://localhost:5173/"
                                    }doctor/${doctorID}`}
                                  >
                                    <Button
                                      className="mt-5 w-full bg-cerise-500"
                                      color="blue"
                                    >
                                      Volver
                                    </Button>
                                  </Link>
                                  <Button
                                    onClick={async () => {
                                      const configuracionesPayload = {
                                        Dias_laborables:
                                          configuraciones.Dias_laborables.join(
                                            ","
                                          ),
                                        Horario: configuraciones.Horario,
                                        Duracion_cita:
                                          configuraciones.Duracion_cita,
                                      };

                                      const [horasInicio, minutosInicio] =
                                        configuraciones.Horario.split("-")[0]
                                          .split(":")
                                          .map(Number);
                                      const [horasFin, minutosFin] =
                                        configuraciones.Horario.split("-")[1]
                                          .split(":")
                                          .map(Number);

                                      if (
                                        !(
                                          horasInicio < horasFin ||
                                          (horasInicio === horasFin &&
                                            minutosInicio < minutosFin)
                                        )
                                      ) {
                                        showToast(
                                          "error",
                                          "La hora de inicio debe ser menor a la hora de fin"
                                        );
                                        return;
                                      }

                                      try {
                                        setLoadingConfig(true);
                                        await editDoctorConfigsRequest(
                                          doctorID,
                                          { configuracionesPayload },
                                          user.token
                                        );
                                        showToast(
                                          "success",
                                          "Configuraciones actualizadas"
                                        );
                                      } catch (error) {
                                        console.log(error);
                                        showToast(
                                          "error",
                                          error.response.data.message,
                                          "center"
                                        );
                                      }
                                      setLoadingConfig(false);
                                    }}
                                    className="w-fit mt-5"
                                    color="blue"
                                  >
                                    Actualizar
                                  </Button>
                                </>
                              ) : (
                                <Loader top="mt-0" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-8">
                            <Alert
                              className="rounded-none border-l-4 border-saffron-200 bg-saffron-500/10 font-medium text-saffron-500 items-center"
                              open
                              icon={<IoIosWarning />}
                            >
                              Para poder actualizar las configuraciones debe
                              tener en cuenta que no puede tener citas agendadas
                              en los nuevos horarios que quiera establecer.
                            </Alert>
                            <div>
                              <h2 className="text-sm font-semibold leading-7 text-gray-900">
                                Días laborables
                              </h2>
                              <div className="mt-5 grid grid-cols-2 sm:grid-cols-7 gap-x-6">
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Lunes"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Lunes"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Lunes
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Martes"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Martes"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Martes
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Miercoles"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Miercoles"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Miércoles
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Jueves"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Jueves"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Jueves
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Viernes"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Viernes"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Viernes
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Sabado"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Sabado"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Sábado
                                  </Typography>
                                </div>
                                <div className="flex">
                                  <Checkbox
                                    color="indigo"
                                    value="Domingo"
                                    checked={configuraciones.Dias_laborables.includes(
                                      "Domingo"
                                    )}
                                    onChange={(e) => {
                                      onLaborableDay(
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <Typography
                                    color="gray"
                                    className="self-center"
                                  >
                                    Domingo
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold leading-7 text-gray-900">
                                Horario de trabajo
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
                                <Controller
                                  name="Inicio"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      color="blue"
                                      label="Horario de Entrada"
                                      variant="standard"
                                      value={
                                        configuraciones.Horario?.split("-")[0]
                                      }
                                      onChange={(e) => {
                                        setConfiguraciones({
                                          ...configuraciones,
                                          Horario: `${e}-${
                                            configuraciones.Horario?.split(
                                              "-"
                                            )[1]
                                          }`,
                                        });
                                      }}
                                    >
                                      {horarios.map((horario) => (
                                        <Option
                                          key={horario}
                                          value={`${horario}`}
                                        >
                                          {horario}
                                        </Option>
                                      ))}
                                    </Select>
                                  )}
                                />
                                <Controller
                                  name="Fin"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      color="blue"
                                      label="Horario de salida"
                                      variant="standard"
                                      value={
                                        configuraciones.Horario?.split("-")[1]
                                      }
                                      onChange={(e) => {
                                        setConfiguraciones({
                                          ...configuraciones,
                                          Horario: `${
                                            configuraciones.Horario?.split(
                                              "-"
                                            )[0]
                                          }-${e}`,
                                        });
                                      }}
                                    >
                                      {horarios.map((horario) => (
                                        <Option
                                          key={horario}
                                          value={`${horario}`}
                                        >
                                          {horario}
                                        </Option>
                                      ))}
                                    </Select>
                                  )}
                                />
                                <Controller
                                  name="Duracion"
                                  rules={{ required: true }}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      color="blue"
                                      label="Duración de la cita"
                                      variant="standard"
                                      onChange={(e) => {
                                        setConfiguraciones({
                                          ...configuraciones,
                                          Duracion_cita: parseInt(e),
                                        });
                                      }}
                                    >
                                      <Option value="15">15 minutos</Option>
                                      <Option value="30">30 minutos</Option>
                                    </Select>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      ) : (
        <Loader top="mt-32" />
      )}
    </>
  );
};

export default DoctorAdministration;
