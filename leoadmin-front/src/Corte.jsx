import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function Corte() {
  const [sucursalId, setSucursalId] = useState("1");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const consultarCorte = async () => {
    try {
      const response = await fetch(`${API_URL}/corte/sucursal/${sucursalId}`);
      const data = await response.json();

      if (!response.ok) {
        setMensaje("Error al consultar corte");
        setResultado(null);
        return;
      }

      setResultado(data);
      setMensaje("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con backend");
      setResultado(null);
    }
  };

  return (
    <div>

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

      <button style={buttonStyle} onClick={consultarCorte}>Consultar corte</button>

      {mensaje && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {mensaje}
        </p>
      )}

      {resultado && (
        <div style={{ marginTop: "20px", border: "1px solid gray", padding: "10px" }}>
          <p><b>Sucursal:</b> {resultado.sucursalId}</p>
          <p><b>Fecha:</b> {resultado.fecha}</p>
          <p><b>Total ventas:</b> {resultado.totalVentas}</p>
          <p><b>Total importe:</b> ${resultado.totalImporte}</p>
        </div>
      )}
    </div>
  );
}

export default Corte;