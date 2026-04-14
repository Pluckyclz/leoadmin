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
        <div>
            {!sesionIniciada ? (
                <div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Sucursal:</label>
                        <br />
                        <input
                            value={sucursalSesion}
                            onChange={(e) => {
                                setSucursalSesion(e.target.value);
                                setMensaje("");
                            }}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Número de empleado:</label>
                        <br />
                        <input
                            value={empleadoSesion}
                            onChange={(e) => {
                                setEmpleadoSesion(e.target.value);
                                setMensaje("");
                            }}
                            style={inputStyle}
                        />
                    </div>

                    <button style={buttonStyle} onClick={iniciarSesionEntrada}>Iniciar sesión de entrada</button>

                    {mensaje && (
                        <p
                            style={{
                                color: mensaje.includes("correctamente") ? "green" : "red",
                                fontWeight: "bold",
                            }}
                        >
                            {mensaje}
                        </p>
                    )}
                </div>
            ) : (
                <div>

                    <p>
                        <b>Sucursal:</b> {sucursalSesion}
                    </p>
                    <p>
                        <b>Empleado:</b> {empleadoSesion}
                    </p>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Código de barras:</label>
                        <br />
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
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Cantidad:</label>
                        <br />
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
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Observación:</label>
                        <br />
                        <input
                            value={observacion}
                            onChange={(e) => {
                                setObservacion(e.target.value);
                                setMensaje("");
                            }}
                            style={inputStyle}
                        />
                    </div>

                    <button onClick={registrarEntrada}>Registrar entrada</button>

                    <button
                        onClick={() => {
                            setSesionIniciada(false);
                            setEmpleadoSesion("");
                            setMensaje("");
                        }}
                        style={buttonStyle}
                    >
                        Cerrar sesión
                    </button>

                    {mensaje && (
                        <p
                            style={{
                                color: mensaje.includes("correctamente") ? "green" : "red",
                                fontWeight: "bold",
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

export default EntradaInventario;