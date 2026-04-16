import { useEffect, useState } from "react";
import EmpleadosTable from "./components/EmpleadosTable";
import EmpleadoFormModal from "./components/EmpleadoFormModal";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  changeEmpleadoStatus,
} from "./services/empleadosService";

const ROLES_MOCK = [
  { id: 1, nombre: "SUPER ADMIN" },
  { id: 2, nombre: "ADMIN" },
  { id: 3, nombre: "GERENTE" },
  { id: 4, nombre: "EMPLEADO" },
];

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setRoles(ROLES_MOCK);
    loadEmpleados();
  }, []);

  async function loadEmpleados() {
    setLoading(true);
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
      setMensaje("Error al cargar empleados");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEmpleadoEdit(null);
    setMensaje("");
    setError(false);
    setOpenModal(true);
  }

  function handleEdit(empleado) {
    setEmpleadoEdit(empleado);
    setMensaje("");
    setError(false);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setEmpleadoEdit(null);
    setMensaje("");
    setError(false);
  }

  async function handleSubmit(payload) {
    try {
      let respuesta;

      if (empleadoEdit) {
        respuesta = await updateEmpleado(empleadoEdit.id, payload);
      } else {
        respuesta = await createEmpleado(payload);
      }

      setMensaje(respuesta);
      setError(false);
      setOpenModal(false);
      setEmpleadoEdit(null);
      await loadEmpleados();
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      setMensaje(err.message || "Error al guardar empleado");
      setError(true);
    }
  }

  async function handleToggleStatus(empleado) {
    try {
      const respuesta = await changeEmpleadoStatus(empleado.id, !empleado.activo);
      setMensaje(respuesta || "Estatus actualizado correctamente");
      setError(false);
      await loadEmpleados();
    } catch (err) {
      console.error("Error al cambiar estatus:", err);
      setMensaje(err.message || "Error al cambiar estatus");
      setError(true);
    }
  }

  return (
    <div>
      <h1>Empleados</h1>

      {!openModal && mensaje && (
        <p
          style={{
            color: error ? "red" : "green",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {mensaje}
        </p>
      )}

      <button onClick={handleCreate}>Nuevo empleado</button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EmpleadosTable
          empleados={empleados}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <EmpleadoFormModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        empleadoEdit={empleadoEdit}
        roles={roles}
        mensaje={mensaje}
        error={error}
      />
    </div>
  );
}