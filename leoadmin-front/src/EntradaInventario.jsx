import { useEffect, useRef, useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function EntradaInventario() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [sucursalSesion, setSucursalSesion] = useState("1");
  const [empleadoSesion, setEmpleadoSesion] = useState("");

  const [codigoBarras, setCodigoBarras] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [observacion, setObservacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const inputCodigoRef = useRef(null);
  const inputCantidadRef = useRef(null);

  useEffect(() => {
    if (sesionIniciada) {
      inputCodigoRef.current?.focus();
    }
  }, [sesionIniciada]);

  const iniciarSesionEntrada = () => {
    if (!sucursalSesion.trim()) {
      setMensaje("La sucursal es obligatoria");
      return;
    }

    if (!empleadoSesion.trim()) {
      setMensaje("El número de empleado es obligatorio");
      return;
    }

    setSesionIniciada(true);
    setMensaje("");
  };

  const registrarEntrada = async () => {
    const body = {
      codigoBarras,
      sucursalId: Number(sucursalSesion),
      cantidad: Number(cantidad),
      numeroEmpleado: empleadoSesion,
      observacion,
    };

    try {
      const response = await fetch(`${API_URL}/inventario/entrada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const texto = await response.text();

      if (!response.ok) {
        setMensaje(texto || "Error al registrar entrada");
        return;
      }

      setMensaje(texto);
      setCodigoBarras("");
      setCantidad("");
      setObservacion("");

      inputCodigoRef.current?.focus();
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con backend");
    }
  };

  return (
    <div style={containerStyle}>
      {!sesionIniciada ? (
        <div style={formCardStyle}>
          <h2 style={titleStyle}>Sesión de entrada</h2>

          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Sucursal</label>
              <input
                value={sucursalSesion}
                onChange={(e) => {
                  setSucursalSesion(e.target.value);
                  setMensaje("");
                }}
                style={inputStyle}
                placeholder="Ej. 1"
              />
            </div>

            <div>
              <label style={labelStyle}>Número de empleado</label>
              <input
                value={empleadoSesion}
                onChange={(e) => {
                  setEmpleadoSesion(e.target.value);
                  setMensaje("");
                }}
                style={inputStyle}
                placeholder="Ej. 1001"
              />
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button style={buttonStyle} onClick={iniciarSesionEntrada}>
              Iniciar sesión
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
      ) : (
        <div style={formCardStyle}>
          <h2 style={titleStyle}>Entrada de inventario</h2>

          <div style={sessionInfoStyle}>
            <span>
              <b>Sucursal:</b> {sucursalSesion}
            </span>

            <span>
              <b>Empleado:</b> {empleadoSesion}
            </span>
          </div>

          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Código de barras</label>
              <input
                value={codigoBarras}
                onChange={(e) => {
                  setCodigoBarras(e.target.value);
                  setMensaje("");
                }}
                ref={inputCodigoRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    inputCantidadRef.current?.focus();
                  }
                }}
                style={inputStyle}
                placeholder="Escanea o escribe"
              />
            </div>

            <div>
              <label style={labelStyle}>Cantidad</label>
              <input
                value={cantidad}
                onChange={(e) => {
                  setCantidad(e.target.value);
                  setMensaje("");
                }}
                ref={inputCantidadRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    registrarEntrada();
                  }
                }}
                style={inputStyle}
                placeholder="Ej. 10"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Observación</label>
              <textarea
                value={observacion}
                onChange={(e) => {
                  setObservacion(e.target.value);
                  setMensaje("");
                }}
                style={textAreaStyle}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div style={buttonRowStyle}>
            <button style={buttonStyle} onClick={registrarEntrada}>
              Registrar entrada
            </button>

            <button
              onClick={() => {
                setSesionIniciada(false);
                setEmpleadoSesion("");
                setMensaje("");
              }}
              style={secondaryButtonStyle}
            >
              Cerrar sesión
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
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: "950px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "6px",
};

const textAreaStyle = {
  ...inputStyle,
  minHeight: "90px",
  resize: "vertical",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#777",
};

const sessionInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  background: "#f4f6f8",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontSize: "14px",
};

const messageStyle = {
  textAlign: "center",
  fontWeight: "bold",
  marginTop: "18px",
};

export default EntradaInventario;