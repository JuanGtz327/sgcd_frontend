import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@material-tailwind/react";

const MedicosEdit = ({ data, patientID }) => {
  const { user } = useAuth();

  const getDelay = (key) => {
    if (key === 0) return 'animate-delay-[150ms]';
    if (key === 1) return 'animate-delay-[300ms]';
    if (key === 2) return 'animate-delay-[450ms]';
    if (key === 3) return 'animate-delay-[600ms]';
    if (key === 4) return 'animate-delay-[750ms]';
    if (key === 5) return 'animate-delay-[900ms]';
    if (key === 6) return 'animate-delay-[1050ms]';
    if (key === 7) return 'animate-delay-[1200ms]';
    if (key === 8) return 'animate-delay-[1350ms]';
    if (key === 9) return 'animate-delay-[1500ms]';
    if (key === 10) return 'animate-delay-[1650ms]';
    if (key === 11) return 'animate-delay-[1800ms]';
    if (key === 12) return 'animate-delay-[1950ms]';
    if (key === 13) return 'animate-delay-[2100ms]';
    if (key === 14) return 'animate-delay-[2250ms]';
    if (key === 15) return 'animate-delay-[2400ms]';
    if (key === 16) return 'animate-delay-[2550ms]';
    if (key === 17) return 'animate-delay-[2700ms]';
    if (key === 18) return 'animate-delay-[2850ms]';
    if (key === 19) return 'animate-delay-[3000ms]';
    if (key === 20) return 'animate-delay-[3150ms]';
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 md:mt-5">
        Historial de médicos
      </h2>

      {!user.idPaciente && (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="mt-1 text-sm leading-6 text-gray-600">
            En este apartado puede consultar los médicos que han atendido a su
            paciente.
          </p>
          <div className="flex justify-between md:justify-start md:gap-5">
            <Link
              to={`${
                import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173/"
              }newDocPac/${patientID}`}
            >
              <Button className="mt-5 w-fit" color="blue">
                Añadir nuevo médico
              </Button>
            </Link>
          </div>
        </div>
      )}
      <section className="text-gray-600 body-font">
        <div className="py-4 grid 2xl:grid-cols-2 2xl:gap-10">
          {data.map(
            ({
              id,
              Doctor: {
                Nombre,
                ApellidoP,
                ApellidoM,
                Especialidad,
                Cedula,
                User: { Correo },
                Domicilio: { Telefono },
              },
            },key) => (
              <div
                className={`flex items-center sm:flex-row flex-col border p-4 mb-4 sm:mb-0 rounded-2xl animate-fade-right animate-duration-[750ms] ${getDelay(key)}`}
                key={id}
              >
                <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="sm:w-16 sm:h-16 w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-2">
                    Médico: {Nombre} {ApellidoP} {ApellidoM}
                  </h2>
                  <p className="leading-relaxed text-base">
                    Especialidad : {Especialidad} <br />
                    Cédula : {Cedula} <br />
                  </p>
                  <a className="mt-3 text-indigo-500 inline-flex items-center">
                    Correo: {Correo} <br />
                    Número telefónico: {Telefono}
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
};

export default MedicosEdit;
