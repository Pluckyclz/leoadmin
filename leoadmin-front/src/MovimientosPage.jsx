import { useEffect, useMemo, useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function MovimientosPage() {
    const [sucursalId, setSucursalId] = useState("1");
    const [tipoMovimiento, setTipoMovimiento] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [movimientos, setMovimientos] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const [pagina, setPagina] = useState(1);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(25);
    const [movimientoDetalle, setMovimientoDetalle] = useState(null);

    useEffect(() => {
        consultarMovimientos();
    }, []);

    async function consultarMovimientos() {
        try {
            setMensaje("");
            setPagina(1);

            let url = `${API_URL}/movimientos-inventario`;
            const params = new URLSearchParams();

            if (sucursalId.trim()) params.append("sucursalId", sucursalId.trim());
            if (tipoMovimiento.trim()) params.append("tipoMovimiento", tipoMovimiento.trim());

            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error al consultar movimientos");
            }

            const data = await response.json();
            setMovimientos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar movimientos");
            setMovimientos([]);
        }
    }

    function limpiarFiltros() {
        setSucursalId("1");
        setTipoMovimiento("");
        setBusqueda("");
        setPagina(1);
        setMensaje("");
    }

    const movimientosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        if (!texto) return movimientos;

        return movimientos.filter((m) => {
            return (
                String(m.codigoBarras || "").toLowerCase().includes(texto) ||
                String(m.descripcionProducto || "").toLowerCase().includes(texto) ||
                String(m.numeroEmpleado || "").toLowerCase().includes(texto) ||
                String(m.observacion || "").toLowerCase().includes(texto)
            );
        });
    }, [movimientos, busqueda]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(movimientosFiltrados.length / registrosPorPagina)
    );

    const movimientosPagina = useMemo(() => {
        const inicio = (pagina - 1) * registrosPorPagina;
        const fin = inicio + registrosPorPagina;
        return movimientosFiltrados.slice(inicio, fin);
    }, [movimientosFiltrados, pagina, registrosPorPagina]);

    function cambiarRegistrosPorPagina(valor) {
        setRegistrosPorPagina(Number(valor));
        setPagina(1);
    }

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h2 style={titleStyle}>Movimientos de inventario</h2>

                <div style={filtersStyle}>
                    <div>
                        <label style={labelStyle}>Sucursal</label>
                        <input
                            value={sucursalId}
                            onChange={(e) => setSucursalId(e.target.value)}
                            style={inputStyle}
                            placeholder="Ej. 1"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Tipo</label>
                        <select
                            value={tipoMovimiento}
                            onChange={(e) => setTipoMovimiento(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Todos</option>
                            <option value="entrada">Entrada</option>
                            <option value="venta">Venta</option>
                            <option value="devolucion">Devolución</option>
                            <option value="ajuste">Ajuste</option>
                            <option value="prest_ext">Préstamo externo</option>
                            <option value="dev_prest_ext">Devolución préstamo</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Buscar</label>
                        <input
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPagina(1);
                            }}
                            style={inputStyle}
                            placeholder="Código, producto, empleado..."
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Ver</label>
                        <select
                            value={registrosPorPagina}
                            onChange={(e) => cambiarRegistrosPorPagina(e.target.value)}
                            style={inputStyle}
                        >
                            <option value={10}>10 registros</option>
                            <option value={25}>25 registros</option>
                            <option value={50}>50 registros</option>
                            <option value={100}>100 registros</option>
                        </select>
                    </div>
                </div>

                <div style={buttonRowStyle}>
                    <button style={buttonStyle} onClick={consultarMovimientos}>
                        Consultar
                    </button>

                    <button style={secondaryButtonStyle} onClick={limpiarFiltros}>
                        Limpiar
                    </button>
                </div>

                {mensaje && <p style={messageStyle}>{mensaje}</p>}

                <div style={summaryStyle}>
                    <span>
                        <b>Resultados:</b> {movimientosFiltrados.length}
                    </span>
                    <span>
                        <b>Página:</b> {pagina} / {totalPaginas}
                    </span>
                </div>

                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Código</th>
                                <th style={thStyle}>Tipo</th>
                                <th style={thStyle}>Cant.</th>
                                <th style={thStyle}>Empleado</th>
                                <th style={thStyle}>Detalle</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movimientosPagina.length === 0 ? (
                                <tr>
                                    <td style={emptyStyle} colSpan="6">
                                        Sin movimientos
                                    </td>
                                </tr>
                            ) : (
                                movimientosPagina.map((m) => (
                                    <tr key={m.id}>
                                        <td style={tdStyle}>{formatearFecha(m.fechaHora)}</td>
                                        <td style={tdStyle}>{m.codigoBarras || "-"}</td>
                                        <td style={tdStyle}>
                                            <span style={badgeStyle(m.tipoMovimiento)}>
                                                {nombreTipo(m.tipoMovimiento)}
                                            </span>
                                        </td>
                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight: "bold",
                                                color: Number(m.cantidad) < 0 ? "#d32f2f" : "#2e7d32",
                                            }}
                                        >
                                            {m.cantidad}
                                        </td>
                                        <td style={tdStyle}>{m.numeroEmpleado || "-"}</td>
                                        <td style={tdStyle}>
                                            <button
                                                style={smallButtonStyle}
                                                onClick={() => setMovimientoDetalle(m)}
                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={paginationStyle}>
                    <button
                        style={secondaryButtonStyle}
                        disabled={pagina <= 1}
                        onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {pagina} de {totalPaginas}
                    </span>

                    <button
                        style={secondaryButtonStyle}
                        disabled={pagina >= totalPaginas}
                        onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {movimientoDetalle && (
                <div style={overlayStyle} onClick={() => setMovimientoDetalle(null)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <button style={closeButtonStyle} onClick={() => setMovimientoDetalle(null)}>
                            ×
                        </button>

                        <h3 style={titleStyle}>Detalle del movimiento</h3>

                        <div style={detailGridStyle}>
                            <p><b>Fecha:</b> {formatearFecha(movimientoDetalle.fechaHora)}</p>
                            <p><b>Tipo:</b> {nombreTipo(movimientoDetalle.tipoMovimiento)}</p>
                            <p><b>Código:</b> {movimientoDetalle.codigoBarras || "-"}</p>
                            <p><b>Producto:</b> {movimientoDetalle.descripcionProducto || "-"}</p>
                            <p><b>Cantidad:</b> {movimientoDetalle.cantidad}</p>
                            <p><b>Empleado:</b> {movimientoDetalle.numeroEmpleado || "-"}</p>
                            <p><b>Sucursal:</b> {movimientoDetalle.sucursalId}</p>
                            <p><b>Referencia:</b> {movimientoDetalle.referenciaId || "-"}</p>
                            <p style={{ gridColumn: "1 / -1" }}>
                                <b>Observación:</b> {movimientoDetalle.observacion || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatearFecha(fecha) {
    if (!fecha) return "-";
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return fecha;
    return date.toLocaleString("es-MX");
}

function nombreTipo(tipo) {
    const value = String(tipo || "").toLowerCase();

    const nombres = {
        entrada: "Entrada",
        venta: "Venta",
        devolucion: "Devolución",
        ajuste: "Ajuste",
        prest_ext: "Préstamo",
        dev_prest_ext: "Dev. préstamo",
    };

    return nombres[value] || tipo || "-";
}

const containerStyle = {
    maxWidth: "1150px",
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

const filtersStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
};

const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
};

const buttonRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "18px",
    flexWrap: "wrap",
};

const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#777",
};

const smallButtonStyle = {
    ...buttonStyle,
    padding: "6px 12px",
};

const messageStyle = {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    marginTop: "16px",
};

const summaryStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px",
    marginBottom: "10px",
    fontSize: "16px",
};

const tableWrapperStyle = {
    overflowX: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    maxHeight: "520px",
    overflowY: "auto",
};

const tableStyle = {
    width: "100%",
    minWidth: "750px",
    borderCollapse: "collapse",
};

const thStyle = {
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1,
};

const tdStyle = {
    padding: "8px 10px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const emptyStyle = {
    padding: "18px",
    textAlign: "center",
    color: "#666",
};

const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
    marginTop: "16px",
    flexWrap: "wrap",
};

const badgeStyle = (tipo) => {
    const normalized = String(tipo || "").toLowerCase();

    let backgroundColor = "#eeeeee";
    let color = "#333";

    if (normalized === "entrada") {
        backgroundColor = "#e8f5e9";
        color = "#2e7d32";
    } else if (normalized === "venta") {
        backgroundColor = "#e3f2fd";
        color = "#1565c0";
    } else if (normalized === "devolucion" || normalized === "dev_prest_ext") {
        backgroundColor = "#fff3e0";
        color = "#ef6c00";
    } else if (normalized === "ajuste") {
        backgroundColor = "#f3e5f5";
        color = "#6a1b9a";
    } else if (normalized === "prest_ext") {
        backgroundColor = "#e0f7fa";
        color = "#00838f";
    }

    return {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "999px",
        fontWeight: "bold",
        backgroundColor,
        color,
        whiteSpace: "nowrap",
    };
};

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
};

const modalStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "650px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const closeButtonStyle = {
    position: "absolute",
    top: "-14px",
    right: "-14px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#d32f2f",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
};

const detailGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "8px 18px",
};

export default MovimientosPage;