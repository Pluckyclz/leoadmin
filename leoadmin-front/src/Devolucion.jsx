import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

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
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>Devolución</h2>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Código de barras</label>
            <input
              value={codigoBarras}
              onChange={(e) => {
                setCodigoBarras(e.target.value);
                setMensaje("");
              }}
              style={inputStyle}
              placeholder="Ej. LEO00000001"
            />
          </div>

          <div>
            <label style={labelStyle}>Sucursal</label>
            <input
              value={sucursalId}
              onChange={(e) => {
                setSucursalId(e.target.value);
                setMensaje("");
              }}
              style={inputStyle}
              placeholder="Ej. 1"
            />
          </div>

          <div>
            <label style={labelStyle}>Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                setMensaje("");
              }}
              style={inputStyle}
              placeholder="Ej. 1"
            />
          </div>

          <div>
            <label style={labelStyle}>Número de empleado</label>
            <input
              value={numeroEmpleado}
              onChange={(e) => {
                setNumeroEmpleado(e.target.value);
                setMensaje("");
              }}
              style={inputStyle}
              placeholder="Ej. 1001"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Motivo</label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                setMensaje("");
              }}
              style={textAreaStyle}
              placeholder="Ej. No le gustó"
            />
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={registrarDevolucion}>
            Registrar devolución
          </button>
        </div>

        {mensaje && (
          <p
            style={{
              ...messageStyle,
              color: mensaje.includes("correctamente") ? "green" : "red",
            }}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "20px",
};

const formCardStyle = {
  ...cardStyle,
  padding: "24px",
};

const titleStyle = {
  marginTop: 0,
  marginBottom: "20px",
  textAlign: "center",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "6px",
};

const textAreaStyle = {
  ...inputStyle,
  minHeight: "80px",
  resize: "vertical",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "18px",
};

const messageStyle = {
  textAlign: "center",
  fontWeight: "bold",
  marginTop: "16px",
};

export default Devolucion;