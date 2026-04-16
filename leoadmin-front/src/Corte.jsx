import { useEffect, useState } from "react";
import { API_URL } from "./config";
import { buttonStyle, cardStyle } from "./styles";

function Corte() {
  const [localId, setLocalId] = useState("");
  const [locales, setLocales] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargandoLocales, setCargandoLocales] = useState(true);

  useEffect(() => {
    cargarLocales();
  }, []);

  async function cargarLocales() {
    try {
      setCargandoLocales(true);
      const response = await fetch(`${API_URL}/locales`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar los locales");
      }

      const data = await response.json();
      setLocales(data);

      if (data.length > 0) {
        setLocalId(String(data[0].id));
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al cargar locales");
    } finally {
      setCargandoLocales(false);
    }
  }

  async function consultarCorte() {
    if (!localId) {
      setMensaje("Selecciona un local");
      setResultado(null);
      return;
    }

    try {
      setMensaje("");
      setResultado(null);

      const response = await fetch(`${API_URL}/corte/local/${localId}`);

      if (!response.ok) {
        throw new Error("Error al consultar corte");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con backend");
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={contenedor}>
        <div style={filtros}>
          <label style={labelStyle}>Local:</label>

          <select
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            style={selectStyle}
            disabled={cargandoLocales}
          >
            <option value="">
              {cargandoLocales ? "Cargando locales..." : "Selecciona un local"}
            </option>

            {locales.map((local) => (
              <option key={local.id} value={local.id}>
                {local.nombre}
              </option>
            ))}
          </select>

          <button onClick={consultarCorte} style={buttonStyle}>
            Consultar corte
          </button>
        </div>

        {mensaje && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "15px" }}>
            {mensaje}
          </p>
        )}

        {resultado && (
          <div style={{ ...cardStyle, marginTop: "20px" }}>
            <p>
              <b>Local:</b>{" "}
              {locales.find((l) => String(l.id) === String(localId))?.nombre ||
                resultado.sucursalId}
            </p>
            <p>
              <b>Fecha:</b> {resultado.fecha}
            </p>
            <p>
              <b>Total de ventas:</b> {resultado.totalVentas}
            </p>
            <p>
              <b>Importe total:</b> ${resultado.totalImporte}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const contenedor = {
  maxWidth: "500px",
  margin: "0 auto",
};

const filtros = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle = {
  fontWeight: "bold",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

export default Corte;