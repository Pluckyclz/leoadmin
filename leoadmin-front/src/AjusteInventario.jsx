import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function AjusteInventario() {
  const [codigoBarras, setCodigoBarras] = useState("");
  const [sucursalId, setSucursalId] = useState("1");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarAjuste = async () => {
    const body = {
      codigoBarras,
      sucursalId: Number(sucursalId),
      nuevaCantidad: Number(nuevaCantidad),
      numeroEmpleado,
      motivo,
    };

    try {
      const response = await fetch(`${API_URL}/inventario/ajuste`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const texto = await response.text();

      if (!response.ok) {
        setMensaje(texto || "Error al registrar ajuste");
        return;
      }

      setMensaje(texto);
      setCodigoBarras("");
      setNuevaCantidad("");
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
        <label>Nueva cantidad:</label>
        <br />
        <input
          value={nuevaCantidad}
          onChange={(e) => {
            setNuevaCantidad(e.target.value);
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

      <button style={buttonStyle} onClick={registrarAjuste}>Registrar ajuste</button>

      {mensaje && (
        <p style={{ color: mensaje.includes("correctamente") ? "green" : "red", fontWeight: "bold" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default AjusteInventario;