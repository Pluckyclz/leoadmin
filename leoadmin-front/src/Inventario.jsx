import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function Inventario() {
    const [sucursalId, setSucursalId] = useState("1");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [genero, setGenero] = useState("");
    const [codigoBarras, setCodigoBarras] = useState("");

    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [imagenPreview, setImagenPreview] = useState(null);

    const consultarInventario = async () => {
        try {
            let url = `${API_URL}/inventario/sucursal/${sucursalId}/filtro`;

            const params = new URLSearchParams();
            if (marca.trim()) params.append("marca", marca);
            if (modelo.trim()) params.append("modelo", modelo);
            if (genero.trim()) params.append("genero", genero);

            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);
            const data = await response.json();

            let resultado = data;

            if (codigoBarras.trim()) {
                resultado = resultado.filter((p) =>
                    p.codigoBarras?.toLowerCase().includes(codigoBarras.toLowerCase())
                );
            }

            setProductos(resultado);
            setMensaje("");
        } catch (error) {
            console.error(error);
            setMensaje("Error al consultar inventario");
        }
    };

    const limpiar = () => {
        setMarca("");
        setModelo("");
        setGenero("");
        setCodigoBarras("");
        setProductos([]);
        setMensaje("");
    };

    const totalPiezas = productos.reduce(
        (acc, p) => acc + Number(p.cantidad || 0),
        0
    );

    const abrirPreviewImagen = (url) => {
        setImagenPreview(url);
    };

    const cerrarPreviewImagen = () => {
        setImagenPreview(null);
    };

    return (
        <div style={container}>
            <h1 style={titleStyle}>Inventario</h1>

            <div style={filtrosWrapper}>
                <div style={filtrosGrid}>
                    <input
                        placeholder="Sucursal"
                        value={sucursalId}
                        onChange={(e) => setSucursalId(e.target.value)}
                        style={filtroInput}
                    />

                    <input
                        placeholder="Marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        style={filtroInput}
                    />

                    <input
                        placeholder="Modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        style={filtroInput}
                    />

                    <input
                        placeholder="Género"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        style={filtroInput}
                    />

                    <input
                        placeholder="Código de barras"
                        value={codigoBarras}
                        onChange={(e) => setCodigoBarras(e.target.value)}
                        style={filtroInputFull}
                    />
                </div>

                <div style={accionesBox}>
                    <button style={buttonStyle} onClick={consultarInventario}>
                        Consultar
                    </button>

                    <button
                        style={{ ...buttonStyle, backgroundColor: "#757575" }}
                        onClick={limpiar}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {mensaje && (
                <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
                    {mensaje}
                </p>
            )}

            <div style={resumenBox}>
                <span>
                    <b>Resultados:</b> {productos.length}
                </span>
                <span>
                    <b>Piezas:</b> {totalPiezas}
                </span>
            </div>

            <div style={{ ...cardStyle, marginTop: "16px", padding: "0" }}>
                {productos.length === 0 ? (
                    <div style={sinResultados}>Sin resultados</div>
                ) : (
                    <div style={tablaWrapper}>
                        <table style={table}>
                            <thead>
                                <tr>
                                    <th style={th}>Img</th>
                                    <th style={th}>Código</th>
                                    <th style={th}>Descripción</th>
                                    <th style={th}>Marca</th>
                                    <th style={th}>Modelo</th>
                                    <th style={th}>Tipo</th>
                                    <th style={th}>Género</th>
                                    <th style={th}>Precio</th>
                                    <th style={th}>Cantidad</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((p) => {
                                    const imageUrl = p.imagenUrl
                                        ? `${API_URL}/uploads/productos/${p.imagenUrl}`
                                        : null;

                                    return (
                                        <tr key={`${p.productoId}-${p.codigoBarras}`}>
                                            <td style={td}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={p.descripcion || p.codigoBarras}
                                                        style={img}
                                                        onClick={() => abrirPreviewImagen(imageUrl)}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={sinImgText}>Sin img</span>
                                                )}
                                            </td>

                                            <td style={td}>{p.codigoBarras}</td>
                                            <td style={td}>
                                                <div style={descripcionCell}>
                                                    {p.descripcion || "-"}
                                                </div>
                                            </td>
                                            <td style={td}>{p.marcaCelular}</td>
                                            <td style={td}>{p.modeloCelular}</td>
                                            <td style={td}>{p.tipoFunda}</td>
                                            <td style={td}>{p.genero}</td>
                                            <td style={td}>${p.precioVenta}</td>
                                            <td style={td}>{p.cantidad}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {imagenPreview && (
                <div style={imageOverlayStyle} onClick={cerrarPreviewImagen}>
                    <div
                        style={imageModalStyle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button style={closeButtonStyle} onClick={cerrarPreviewImagen}>
                            ×
                        </button>

                        <img
                            src={imagenPreview}
                            alt="Vista previa"
                            style={previewImageStyle}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const container = {
    padding: "20px",
};

const titleStyle = {
    textAlign: "center",
    marginBottom: "24px",
};

const filtrosWrapper = {
    maxWidth: "950px",
    margin: "0 auto 20px auto",
};

const filtrosGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
};

const filtroInput = {
    ...inputStyle,
    width: "100%",
};

const filtroInputFull = {
    ...inputStyle,
    width: "100%",
    gridColumn: "1 / -1",
};

const accionesBox = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
};

const resumenBox = {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    marginTop: "12px",
    fontWeight: "bold",
    flexWrap: "wrap",
};

const tablaWrapper = {
    overflowX: "auto",
    maxHeight: "520px",
    overflowY: "auto",
};

const table = {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "collapse",
    fontSize: "13px",
};

const th = {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
    position: "sticky",
    top: 0,
    zIndex: 1,
    whiteSpace: "nowrap",
};

const td = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const img = {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ddd",
    display: "block",
    cursor: "pointer",
};

const sinImgText = {
    fontSize: "11px",
    color: "#999",
};

const descripcionCell = {
    maxWidth: "260px",
    whiteSpace: "normal",
    lineHeight: "1.3",
};

const sinResultados = {
    textAlign: "center",
    padding: "18px",
    color: "#666",
};

const imageOverlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    padding: "20px",
};

const imageModalStyle = {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const previewImageStyle = {
    maxWidth: "90vw",
    maxHeight: "85vh",
    borderRadius: "10px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
    backgroundColor: "#fff",
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
    lineHeight: "36px",
};

export default Inventario;