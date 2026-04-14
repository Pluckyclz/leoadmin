import { useRef, useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function Venta() {
    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [codigoBarras, setCodigoBarras] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [tipoVenta, setTipoVenta] = useState("publico");

    const inputCodigoRef = useRef(null);

    const agregarProducto = async () => {
        if (!codigoBarras.trim()) return;

        try {
            // 1. Obtener producto
            const respProducto = await fetch(
                `${API_URL}/productos/codigo/${codigoBarras}`
            );
            const producto = await respProducto.json();

            if (!producto || !producto.id) {
                setMensaje("Producto no encontrado");
                return;
            }

            // 2. Consultar inventario
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

            // 3. Agregar al carrito
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

        if (inputCodigoRef.current) {
            inputCodigoRef.current.focus();
        }
    };

    const registrarVenta = async () => {
        if (!numeroEmpleado.trim()) {
            setMensaje("El número de empleado es obligatorio");
            return;
        }

        if (carrito.length === 0) {
            setMensaje("No hay productos en el carrito");
            return;
        }

        const body = {
            sucursalId: 1,
            numeroEmpleado: numeroEmpleado,
            tipoVenta: tipoVenta,
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
            setMostrarConfirmacion(false);
            inputCodigoRef.current?.focus();

            if (inputCodigoRef.current) {
                inputCodigoRef.current.focus();
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el backend");
        }
    };

    const manejarEnterCodigo = (e) => {
        if (e.key === "Enter") {
            agregarProducto();
        }
    };

    const total = carrito.reduce((acumulado, item) => {
        const precio =
            tipoVenta === "especial"
                ? Number(item.precioEspecial || item.precioVenta)
                : Number(item.precioVenta);

        return acumulado + precio * item.cantidad;
    }, 0);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>

            <div style={{ marginBottom: "20px" }}>
                <label>Código de barras:</label>
                <br />
                <input
                    ref={inputCodigoRef}
                    type="text"
                    value={codigoBarras}
                    onChange={(e) => {
                        setCodigoBarras(e.target.value);
                        setMensaje("");
                    }}
                    onKeyDown={manejarEnterCodigo}
                    style={inputStyle}
                />
                <button
                    onClick={agregarProducto}
                    style={buttonStyle}
                >
                    Agregar
                </button>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <label>Tipo de venta:</label>
                <br />
                <select
                    value={tipoVenta}
                    onChange={(e) => setTipoVenta(e.target.value)}
                    style={{ width: "200px", padding: "8px", marginTop: "5px" }}
                >
                    <option value="publico">Público</option>
                    <option value="especial">Locatario</option>
                </select>
            </div>

            {mensaje && (
                <p style={{
                    color: mensaje.includes("OK") ? "green" : "red",
                    fontWeight: "bold"
                }}>
                    {mensaje}
                </p>
            )}

            <h2>Carrito</h2>

            {carrito.length === 0 ? (
                <p>No hay productos agregados</p>
            ) : (
                <>
                    {carrito.map((item, index) => (
                        <div
                            key={index}
                            style={cardStyle}
                        >
                            <p><b>Marca:</b> {item.marcaCelular}</p>
                            <p><b>Modelo:</b> {item.modeloCelular}</p>
                            <p><b>Tipo:</b> {item.tipoFunda}</p>
                            <p><b>Género:</b> {item.genero}</p>
                            <p>
                                <b>Precio:</b> $
                                {tipoVenta === "especial"
                                    ? item.precioEspecial || item.precioVenta
                                    : item.precioVenta}
                            </p>
                            <p><b>Código:</b> {item.codigoBarras}</p>
                            <p><b>Cantidad:</b> {item.cantidad}</p>

                            <button style={{ ...buttonStyle, backgroundColor: "#d32f2f" }} onClick={() => quitarProducto(item.codigoBarras)}>
                                Quitar uno
                            </button>
                        </div>
                    ))}

                    <h3>Total: ${total.toFixed(2)}</h3>

                    <button
                        onClick={() => setMostrarConfirmacion(true)}
                        style={buttonStyle}
                    >
                        Registrar venta
                    </button>
                    {mostrarConfirmacion && (
                        <div
                            style={{
                                border: "1px solid gray",
                                padding: "15px",
                                marginTop: "20px",
                                backgroundColor: "#f5f5f5",
                                width: "320px"
                            }}
                        >
                            <p><b>Confirmar venta</b></p>

                            <label>Número de empleado:</label>
                            <br />
                            <input
                                type="text"
                                value={numeroEmpleado}
                                onChange={(e) => {
                                    setNumeroEmpleado(e.target.value);
                                    setMensaje("");
                                }}
                                style={inputStyle}
                            />

                            <button onClick={registrarVenta} style={inputStyle}>
                                Confirmar
                            </button>

                            <button
                                onClick={() => {
                                    setMostrarConfirmacion(false);
                                    setNumeroEmpleado("");
                                }}
                                style={buttonStyle}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default Venta;