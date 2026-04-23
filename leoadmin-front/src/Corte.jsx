import { useEffect, useState } from "react";
import { API_URL } from "./config";
import { buttonStyle, cardStyle, inputStyle } from "./styles";

function Corte() {
  const [localId, setLocalId] = useState("");
  const [locales, setLocales] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cortes, setCortes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargandoLocales, setCargandoLocales] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [fechaOperacion, setFechaOperacion] = useState(obtenerFechaHoy());
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [efectivoContado, setEfectivoContado] = useState("");
  const [fondoCambio, setFondoCambio] = useState("");
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    cargarLocales();
  }, []);

  async function cargarLocales() {
    try {
      setCargandoLocales(true);
      setMensaje("");

      let response = await fetch(`${API_URL}/catalogos/locales/activos`);

      if (!response.ok) {
        response = await fetch(`${API_URL}/catalogos/locales`);
      }

      if (!response.ok) {
        throw new Error("No se pudieron cargar los locales");
      }

      const data = await response.json();
      const activos = Array.isArray(data)
        ? data.filter((x) => x.activo !== false)
        : [];

      setLocales(activos);

      if (activos.length > 0) {
        setLocalId(String(activos[0].id));
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al cargar locales");
    } finally {
      setCargandoLocales(false);
    }
  }

  async function consultarResumen() {
    if (!localId) {
      setMensaje("Selecciona un local");
      setResumen(null);
      return;
    }

    if (!fechaOperacion) {
      setMensaje("Selecciona una fecha");
      setResumen(null);
      return;
    }

    try {
      setMensaje("");
      setResumen(null);

      const response = await fetch(
        `${API_URL}/resumen-caja/local/${localId}?fecha=${fechaOperacion}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar resumen de caja");
      }

      const data = await response.json();
      setResumen(data);
    } catch (error) {
      console.error(error);
      setMensaje("Error al consultar resumen de caja");
    }
  }

  async function consultarCortesGuardados() {
    if (!localId) {
      setMensaje("Selecciona un local");
      setCortes([]);
      return;
    }

    if (!fechaOperacion) {
      setMensaje("Selecciona una fecha");
      setCortes([]);
      return;
    }

    try {
      setMensaje("");

      const response = await fetch(
        `${API_URL}/cortes-caja/local/${localId}/fecha?fecha=${fechaOperacion}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar cortes");
      }

      const data = await response.json();
      setCortes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMensaje("Error al consultar cortes guardados");
    }
  }

  async function registrarCorte() {
    if (!fechaOperacion) {
      setMensaje("La fecha de operación es obligatoria");
      return;
    }

    if (!numeroEmpleado.trim()) {
      setMensaje("El número de empleado es obligatorio");
      return;
    }

    if (efectivoContado === "") {
      setMensaje("El efectivo contado es obligatorio");
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const payload = {
        numeroEmpleado: Number(numeroEmpleado),
        fechaOperacion,
        efectivoContado: Number(efectivoContado),
        fondoCambio: fondoCambio === "" ? 0 : Number(fondoCambio),
        observacion: observacion.trim() || null,
      };

      const response = await fetch(`${API_URL}/cortes-caja`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.mensaje) {
        throw new Error("No se pudo registrar el corte");
      }

      if (data.mensaje !== "Corte registrado correctamente") {
        setMensaje(data.mensaje);
        return;
      }

      setMensaje("Corte registrado correctamente");
      await consultarResumen();
      await consultarCortesGuardados();

      setEfectivoContado("");
      setFondoCambio("");
      setObservacion("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al registrar corte");
    } finally {
      setGuardando(false);
    }
  }

  function nombreLocalSeleccionado() {
    return locales.find((l) => String(l.id) === String(localId))?.nombre || localId;
  }

  return (
    <div style={pageStyle}>
      <div style={contenedor}>
        <div style={cardStyle}>
          <h2 style={tituloStyle}>Caja / Corte</h2>

          <div style={grid}>
            <div>
              <label style={labelStyle}>Local</label>
              <select
                value={localId}
                onChange={(e) => setLocalId(e.target.value)}
                style={inputStyle}
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
            </div>

            <div>
              <label style={labelStyle}>Fecha de operación</label>
              <input
                type="date"
                value={fechaOperacion}
                onChange={(e) => setFechaOperacion(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={accionesRow}>
            <button style={buttonStyle} onClick={consultarResumen}>
              Consultar resumen
            </button>

            <button
              style={{ ...buttonStyle, backgroundColor: "#455a64" }}
              onClick={consultarCortesGuardados}
            >
              Ver cortes guardados
            </button>
          </div>

          <p style={warningText}>
            Nota: con el backend actual, al registrar un corte el local se toma por IP del equipo
            que hace la operación. La consulta sí puede hacerse por cualquier local.
          </p>

          {mensaje && <p style={mensajeStyle}>{mensaje}</p>}
        </div>

        {resumen && (
          <div style={{ ...cardStyle, marginTop: "20px" }}>
            <h3 style={subtituloStyle}>Resumen de caja</h3>

            <div style={resumenGrid}>
              <ResumenItem label="Local" value={nombreLocalSeleccionado()} />
              <ResumenItem label="Fecha" value={resumen.fecha} />
              <ResumenItem
                label="Ventas efectivo"
                value={formatearMoneda(resumen.ventasEfectivo)}
              />
              <ResumenItem
                label="Ventas transferencia"
                value={formatearMoneda(resumen.ventasTransferencia)}
              />
              <ResumenItem
                label="Devoluciones efectivo"
                value={formatearMoneda(resumen.devolucionesEfectivo)}
              />
              <ResumenItem
                label="Devoluciones transferencia"
                value={formatearMoneda(resumen.devolucionesTransferencia)}
              />
              <ResumenItem
                label="Retiros gerenciales"
                value={formatearMoneda(resumen.retirosGerenciales)}
              />
              <ResumenItem
                label="Efectivo esperado"
                value={formatearMoneda(resumen.efectivoEsperado)}
                destacado
              />
            </div>
          </div>
        )}

        <div style={{ ...cardStyle, marginTop: "20px" }}>
          <h3 style={subtituloStyle}>Registrar corte</h3>

          <div style={grid}>
            <div>
              <label style={labelStyle}>Número de empleado</label>
              <input
                type="number"
                value={numeroEmpleado}
                onChange={(e) => setNumeroEmpleado(e.target.value)}
                style={inputStyle}
                placeholder="Ej. 1001"
              />
            </div>

            <div>
              <label style={labelStyle}>Efectivo contado</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={efectivoContado}
                onChange={(e) => setEfectivoContado(e.target.value)}
                style={inputStyle}
                placeholder="Ej. 1500"
              />
            </div>

            <div>
              <label style={labelStyle}>Fondo para cambio</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fondoCambio}
                onChange={(e) => setFondoCambio(e.target.value)}
                style={inputStyle}
                placeholder="Ej. 300"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Observación</label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                style={textareaStyle}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div style={accionesRow}>
            <button
              style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
              onClick={registrarCorte}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Registrar corte"}
            </button>
          </div>
        </div>

        <div style={{ ...cardStyle, marginTop: "20px" }}>
          <h3 style={subtituloStyle}>Cortes guardados</h3>

          {cortes.length === 0 ? (
            <p style={sinResultadosStyle}>Sin cortes guardados para la fecha seleccionada</p>
          ) : (
            <div style={tablaWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Fecha / hora</th>
                    <th style={thStyle}>Empleado</th>
                    <th style={thStyle}>Esperado</th>
                    <th style={thStyle}>Contado</th>
                    <th style={thStyle}>Fondo cambio</th>
                    <th style={thStyle}>Diferencia</th>
                    <th style={thStyle}>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {cortes.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>{formatearFechaHora(item.fechaHora)}</td>
                      <td style={tdStyle}>{item.numeroEmpleado}</td>
                      <td style={tdStyle}>{formatearMoneda(item.efectivoEsperado)}</td>
                      <td style={tdStyle}>{formatearMoneda(item.efectivoContado)}</td>
                      <td style={tdStyle}>{formatearMoneda(item.fondoCambio)}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: Number(item.diferencia) === 0 ? "#2e7d32" : "#c62828",
                          fontWeight: "bold",
                        }}
                      >
                        {formatearMoneda(item.diferencia)}
                      </td>
                      <td style={tdStyle}>{item.observacion || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResumenItem({ label, value, destacado = false }) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "12px",
        backgroundColor: destacado ? "#f1f8e9" : "#fafafa",
      }}
    >
      <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{value}</div>
    </div>
  );
}

function obtenerFechaHoy() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

function formatearFechaHora(valor) {
  if (!valor) return "-";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleString("es-MX");
}

const pageStyle = {
  padding: "20px",
};

const contenedor = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const tituloStyle = {
  marginTop: 0,
  marginBottom: "16px",
  textAlign: "center",
};

const subtituloStyle = {
  marginTop: 0,
  marginBottom: "16px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const resumenGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "12px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "6px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "90px",
  resize: "vertical",
};

const accionesRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "16px",
};

const mensajeStyle = {
  color: "red",
  fontWeight: "bold",
  marginTop: "15px",
  textAlign: "center",
};

const warningText = {
  marginTop: "12px",
  fontSize: "13px",
  color: "#666",
};

const tablaWrapper = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#f5f5f5",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

const sinResultadosStyle = {
  margin: 0,
  color: "#666",
};

export default Corte;