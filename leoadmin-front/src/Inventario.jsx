import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function Inventario() {
    const [sucursalId, setSucursalId] = useState("1");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [genero, setGenero] = useState("");
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const [paginaActual, setPaginaActual] = useState(1);
    const [orden, setOrden] = useState({ campo: null, direccion: "asc" });
    const productosPorPagina = 10;

    const [codigoBarras, setCodigoBarras] = useState("");

    const totalResultados = productos.length;

    const totalPiezas = productos.reduce((acc, p) => acc + Number(p.cantidad || 0), 0);

    const indicadorOrden = (campo) => {
        if (orden.campo !== campo) return "";
        return orden.direccion === "asc" ? " ↑" : " ↓";
    };

    const ordenar = (campo) => {
        let direccion = "asc";

        if (orden.campo === campo && orden.direccion === "asc") {
            direccion = "desc";
        }

        setOrden({ campo, direccion });
    };

    const consultarInventario = async () => {
        try {
            let url = `${API_URL}/inventario/sucursal/${sucursalId}/filtro`;

            const params = new URLSearchParams();
            if (marca.trim()) params.append("marca", marca);
            if (modelo.trim()) params.append("modelo", modelo);
            if (genero.trim()) params.append("genero", genero);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            let resultado = data;

            if (codigoBarras.trim()) {
                resultado = resultado.filter((p) =>
                    p.codigoBarras?.includes(codigoBarras)
                );
            }

            setProductos(resultado);
            setPaginaActual(1);
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
        setProductos([]);
        setMensaje("");
        setPaginaActual(1);
        setCodigoBarras("");
    };

    const productosOrdenados = [...productos].sort((a, b) => {
        if (!orden.campo) return 0;

        let valorA = a[orden.campo];
        let valorB = b[orden.campo];

        if (typeof valorA === "string") valorA = valorA.toLowerCase();
        if (typeof valorB === "string") valorB = valorB.toLowerCase();

        if (valorA < valorB) return orden.direccion === "asc" ? -1 : 1;
        if (valorA > valorB) return orden.direccion === "asc" ? 1 : -1;
        return 0;
    });

    const indiceUltimo = paginaActual * productosPorPagina;
    const indicePrimero = indiceUltimo - productosPorPagina;
    const productosPagina = productosOrdenados.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    return (
        <div>
            <h1>Leoadmin - Inventario</h1>

            <div style={{ marginBottom: "10px" }}>
                <label>Sucursal:</label>
                <br />
                <input
                    style={inputStyle}
                    type="text"
                    value={sucursalId}
                    onChange={(e) => setSucursalId(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Marca:</label>
                <br />
                <input
                    style={inputStyle}
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Modelo:</label>
                <br />
                <input
                    style={inputStyle}
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Género:</label>
                <br />
                <input
                    style={inputStyle}
                    type="text"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Código de barras:</label>
                <br />
                <input
                    style={inputStyle}
                    type="text"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                />
            </div>

            <button style={buttonStyle} onClick={consultarInventario}>
                Consultar
            </button>

            <button
                onClick={limpiar}
                style={{ ...buttonStyle, backgroundColor: "#757575", marginLeft: "10px" }}
            >
                Limpiar
            </button>

            {mensaje && (
                <p style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
                    {mensaje}
                </p>
            )}

            {productos.length === 0 && !mensaje && (
                <p style={{ marginTop: "20px" }}>Sin resultados</p>
            )}
            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <b>Resultados:</b> {totalResultados} | <b>Total de piezas:</b> {totalPiezas}
            </div>
            {productos.length > 0 && (
                <div style={{ marginTop: "20px", ...cardStyle }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th onClick={() => ordenar("codigoBarras")} style={{ cursor: "pointer" }}>Código{indicadorOrden("codigoBarras")}</th>
                                <th onClick={() => ordenar("marcaCelular")} style={{ cursor: "pointer" }}>Marca{indicadorOrden("codigoBarras")}</th>
                                <th onClick={() => ordenar("modeloCelular")} style={{ cursor: "pointer" }}>Modelo{indicadorOrden("codigoBarras")}</th>
                                <th>Tipo</th>
                                <th>Género</th>
                                <th>Precio</th>
                                <th onClick={() => ordenar("cantidad")}>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosPagina.map((p) => (
                                <tr key={p.productoId}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.codigoBarras}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.marcaCelular}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.modeloCelular}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.tipoFunda}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.genero}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>${p.precioVenta}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{p.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: "#757575" }}
                            onClick={() => setPaginaActual(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>

                        <span>
                            Página {paginaActual} de {totalPaginas || 1}
                        </span>

                        <button
                            style={buttonStyle}
                            onClick={() => setPaginaActual(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas || totalPaginas === 0}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventario;