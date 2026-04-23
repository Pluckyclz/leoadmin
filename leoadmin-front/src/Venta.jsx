import { useRef, useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle } from "./styles";

function Venta() {
    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [metodoPago, setMetodoPago] = useState("efectivo");
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [codigoBarras, setCodigoBarras] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [tipoVenta, setTipoVenta] = useState("publico");
    const [vendiendo, setVendiendo] = useState(false);
    const [imagenPreview, setImagenPreview] = useState(null);

    const inputCodigoRef = useRef(null);

    const agregarProducto = async () => {
        if (!codigoBarras.trim()) return;

        try {
            const respProducto = await fetch(
                `${API_URL}/productos/codigo/${codigoBarras}`
            );
            const producto = await respProducto.json();

            if (!producto || !producto.id) {
                setMensaje("Producto no encontrado");
                return;
            }

            const respInventario = await fetch(
                `${API_URL}/inventario/sucursal/1/filtro?marca=${producto.marcaCelular}&modelo=${producto.modeloCelular}`
            );

            const inventario = await respInventario.json();

            const itemInv = inventario.find(
                (i) => i.codigoBarras === producto.codigoBarras
            );

            if (!itemInv || itemInv.cantidad <= 0) {
                setMensaje("Sin inventario disponible");
                return;
            }

            const existente = carrito.find(
                (item) => item.codigoBarras === producto.codigoBarras
            );

            const cantidadActual = existente ? existente.cantidad : 0;

            if (cantidadActual + 1 > itemInv.cantidad) {
                setMensaje("No hay suficiente inventario");
                return;
            }

            if (cantidadActual) {
                const nuevoCarrito = carrito.map((item) =>
                    item.codigoBarras === producto.codigoBarras
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
                setCarrito(nuevoCarrito);
            } else {
                setCarrito([
                    ...carrito,
                    {
                        ...producto,
                        cantidad: 1,
                    },
                ]);
            }

            setCodigoBarras("");
            setMensaje("");
            inputCodigoRef.current?.focus();
        } catch (error) {
            console.error(error);
            setMensaje("Error al validar inventario");
        }
    };

    const quitarProducto = (codigo) => {
        const producto = carrito.find((item) => item.codigoBarras === codigo);

        if (!producto) return;

        if (producto.cantidad > 1) {
            const nuevoCarrito = carrito.map((item) =>
                item.codigoBarras === codigo
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
            setCarrito(nuevoCarrito);
        } else {
            const nuevoCarrito = carrito.filter(
                (item) => item.codigoBarras !== codigo
            );
            setCarrito(nuevoCarrito);
        }

        inputCodigoRef.current?.focus();
    };

    const registrarVenta = async () => {
        if (vendiendo) return;
        setVendiendo(true);

        if (!numeroEmpleado.trim()) {
            setMensaje("El número de empleado es obligatorio");
            setVendiendo(false);
            return;
        }

        if (carrito.length === 0) {
            setMensaje("No hay productos en el carrito");
            setVendiendo(false);
            return;
        }

        const body = {
            numeroEmpleado: Number(numeroEmpleado),
            tipoVenta,
            metodoPago,
            productos: carrito.map((item) => ({
                codigoBarras: item.codigoBarras,
                cantidad: item.cantidad,
            })),
        };

        try {
            const response = await fetch(`${API_URL}/ventas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.mensaje || "Error al registrar venta");
                return;
            }

            setMensaje(`Venta OK #${data.ventaId}`);
            setCarrito([]);
            setCodigoBarras("");
            setNumeroEmpleado("");
            setMetodoPago("efectivo");
            setMostrarConfirmacion(false);
            inputCodigoRef.current?.focus();
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el backend");
        } finally {
            setVendiendo(false);
        }
    };

    const manejarEnterCodigo = (e) => {
        if (e.key === "Enter") {
            agregarProducto();
        }
    };

    const abrirPreviewImagen = (url) => {
        setImagenPreview(url);
    };

    const cerrarPreviewImagen = () => {
        setImagenPreview(null);
    };

    const total = carrito.reduce((acumulado, item) => {
        const precio =
            tipoVenta === "especial"
                ? Number(item.precioEspecial || item.precioVenta)
                : Number(item.precioVenta);

        return acumulado + precio * item.cantidad;
    }, 0);

    return (
        <div style={containerStyle}>
            <div style={topSection}>
                <div style={fieldBlock}>
                    <label style={labelStyle}>Código de barras:</label>
                    <div style={codigoRow}>
                        <input
                            ref={inputCodigoRef}
                            type="text"
                            value={codigoBarras}
                            onChange={(e) => {
                                setCodigoBarras(e.target.value);
                                setMensaje("");
                            }}
                            onKeyDown={manejarEnterCodigo}
                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <button onClick={agregarProducto} style={buttonStyle}>
                            Agregar
                        </button>
                    </div>
                </div>

                <div style={fieldBlockSmall}>
                    <label style={labelStyle}>Tipo de venta:</label>
                    <select
                        value={tipoVenta}
                        onChange={(e) => setTipoVenta(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="publico">Público</option>
                        <option value="especial">Locatario</option>
                    </select>
                </div>
            </div>

            {mensaje && (
                <p
                    style={{
                        color: mensaje.includes("OK") ? "green" : "red",
                        fontWeight: "bold",
                        marginBottom: "15px",
                    }}
                >
                    {mensaje}
                </p>
            )}

            <h2 style={{ marginBottom: "15px", textAlign: "center" }}>Carrito</h2>

            <div style={carritoBox}>
                {carrito.length === 0 ? (
                    <p style={{ margin: 0 }}>No hay productos agregados</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Img</th>
                                    <th style={thStyle}>Código</th>
                                    <th style={thStyle}>Descripción</th>
                                    <th style={thStyle}>Marca</th>
                                    <th style={thStyle}>Modelo</th>
                                    <th style={thStyle}>Precio</th>
                                    <th style={thStyle}>Cantidad</th>
                                    <th style={thStyle}>Subtotal</th>
                                    <th style={thStyle}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map((item) => {
                                    const precio =
                                        tipoVenta === "especial"
                                            ? Number(item.precioEspecial || item.precioVenta)
                                            : Number(item.precioVenta);

                                    const imageUrl = item.imagenUrl
                                        ? `${API_URL}/uploads/productos/${item.imagenUrl}`
                                        : null;

                                    return (
                                        <tr key={item.codigoBarras}>
                                            <td style={tdStyle}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.descripcion || item.codigoBarras}
                                                        style={imgStyle}
                                                        onClick={() => abrirPreviewImagen(imageUrl)}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={sinImagenStyle}>Sin img</span>
                                                )}
                                            </td>

                                            <td style={tdStyle}>{item.codigoBarras}</td>

                                            <td style={tdStyle}>
                                                <div style={descripcionStyle}>
                                                    {item.descripcion ||
                                                        `${item.tipoFunda || ""} ${item.genero || ""}`.trim()}
                                                </div>
                                            </td>

                                            <td style={tdStyle}>{item.marcaCelular}</td>
                                            <td style={tdStyle}>{item.modeloCelular}</td>
                                            <td style={tdStyle}>${precio}</td>
                                            <td style={tdStyle}>{item.cantidad}</td>
                                            <td style={tdStyle}>
                                                ${(precio * item.cantidad).toFixed(2)}
                                            </td>
                                            <td style={tdStyle}>
                                                <button
                                                    style={{
                                                        ...buttonStyle,
                                                        backgroundColor: "#d32f2f",
                                                        padding: "6px 10px",
                                                    }}
                                                    onClick={() => quitarProducto(item.codigoBarras)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={bottomSection}>
                <h3 style={{ margin: 0 }}>Total: ${total.toFixed(2)}</h3>

                <button
                    onClick={() => setMostrarConfirmacion(true)}
                    style={buttonStyle}
                    disabled={carrito.length === 0}
                >
                    Registrar venta
                </button>
            </div>

            {mostrarConfirmacion && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ marginTop: 0, textAlign: "center" }}>
                            Confirmar venta
                        </h3>

                        <label style={{ ...labelStyle, textAlign: "center" }}>
                            Número de empleado:
                        </label>

                        <input
                            type="number"
                            value={numeroEmpleado}
                            onChange={(e) => {
                                setNumeroEmpleado(e.target.value);
                                setMensaje("");
                            }}
                            style={{ ...inputStyle, width: "100%" }}
                            autoFocus
                        />

                        <label style={{ ...labelStyle, textAlign: "center", marginTop: "12px" }}>
                            Método de pago:
                        </label>

                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                        </select>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "12px",
                                marginTop: "15px",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={registrarVenta}
                                disabled={vendiendo}
                                style={{
                                    ...buttonStyle,
                                    opacity: vendiendo ? 0.7 : 1,
                                    cursor: vendiendo ? "not-allowed" : "pointer",
                                }}
                            >
                                {vendiendo ? "Procesando..." : "Confirmar"}
                            </button>

                            <button
                                onClick={() => {
                                    setMostrarConfirmacion(false);
                                    setNumeroEmpleado("");
                                    setMetodoPago("efectivo");
                                }}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: "#d32f2f",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

const containerStyle = {
    padding: "20px",
    fontFamily: "Arial",
};

const topSection = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
};

const fieldBlock = {
    flex: 1,
    minWidth: "280px",
};

const fieldBlockSmall = {
    width: "220px",
    maxWidth: "100%",
};

const codigoRow = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
};

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
};

const selectStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const carritoBox = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    minHeight: "220px",
    maxHeight: "360px",
    overflowY: "auto",
};

const tableStyle = {
    width: "100%",
    minWidth: "1000px",
    borderCollapse: "collapse",
    fontSize: "13px",
};

const thStyle = {
    textAlign: "left",
    padding: "6px 6px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
};

const tdStyle = {
    padding: "6px 6px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const imgStyle = {
    width: "54px",
    height: "54px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ddd",
    display: "block",
    cursor: "pointer",
};

const sinImagenStyle = {
    fontSize: "11px",
    color: "#999",
};

const descripcionStyle = {
    maxWidth: "230px",
    whiteSpace: "normal",
    lineHeight: "1.3",
};

const bottomSection = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "16px",
};

const modalStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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

export default Venta;