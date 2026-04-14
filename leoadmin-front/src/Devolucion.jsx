import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle } from "./styles";

function Devolucion() {
  const [codigoBarras, setCodigoBarras] = useState("");
  const [sucursalId, setSucursalId] = useState("1");
  const [cantidad, setCantidad] = useState("");
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarDevolucion = async () => {
    const body = {
      codigoBarras,
      sucursalId: Number(sucursalId),
      cantidad: Number(cantidad),
      numeroEmpleado,
      motivo,
    };

    try {
      const response = await fetch(`${API_URL}/inventario/devolucion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const texto = await response.text();

      if (!response.ok) {
        setMensaje(texto || "Error al registrar devolución");
        return;
      }

      setMensaje(texto);
      setCodigoBarras("");
      setCantidad("");
      setMotivo("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con backend");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <label>Código de barras:</label>
        <br />
        <input
          value={codigoBarras}
          onChange={(e) => {
            setCodigoBarras(e.target.value);
            setMensaje("");
          }}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Sucursal:</label>
        <br />
        <input
          value={sucursalId}
          onChange={(e) => {
            setSucursalId(e.target.value);
            setMensaje("");
          }}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Cantidad:</label>
        <br />
        <input
          value={cantidad}
          onChange={(e) => {
            setCantidad(e.target.value);
            setMensaje("");
          }}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Número de empleado:</label>
        <br />
        <input
          value={numeroEmpleado}
          onChange={(e) => {
            setNumeroEmpleado(e.target.value);
            setMensaje("");
          }}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Motivo:</label>
        <br />
        <input
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            setMensaje("");
          }}
          style={inputStyle}
        />
      </div>

      <button style={buttonStyle} onClick={registrarDevolucion}>Registrar devolución</button>

      {mensaje && (
        <p style={{ color: mensaje.includes("correctamente") ? "green" : "red", fontWeight: "bold" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default Devolucion;