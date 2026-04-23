import { useEffect, useRef, useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function PrestamoExterno() {
    const [sucursalId, setSucursalId] = useState("");
    const [locales, setLocales] = useState([]);
    const [cargandoLocales, setCargandoLocales] = useState(false);

    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [nombreLocalExterno, setNombreLocalExterno] = useState("");
    const [observacion, setObservacion] = useState("");

    const [codigoBarras, setCodigoBarras] = useState("");
    const [piezas, setPiezas] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [prestamos, setPrestamos] = useState([]);

    const [detalleModalAbierto, setDetalleModalAbierto] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [detallePrestamo, setDetallePrestamo] = useState([]);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    const [codigoAccion, setCodigoAccion] = useState("");
    const [piezaActiva, setPiezaActiva] = useState(null);
    const [numeroEmpleadoVenta, setNumeroEmpleadoVenta] = useState("");
    const [metodoPagoVenta, setMetodoPagoVenta] = useState("efectivo");
    const [procesandoAccion, setProcesandoAccion] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");
    const [errorEmpleadoVenta, setErrorEmpleadoVenta] = useState(false);

    const [imagenPreview, setImagenPreview] = useState(null);

    const inputCodigoRef = useRef(null);
    const inputCodigoAccionRef = useRef(null);
    const inputEmpleadoVentaRef = useRef(null);

    useEffect(() => {
        cargarLocales();
    }, []);

    useEffect(() => {
        if (sucursalId) {
            consultarPrestamos();
        }
    }, [sucursalId]);

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
            const lista = Array.isArray(data) ? data : [];
            const activos = lista.filter((item) => item.activo !== false);

            setLocales(activos);

            if (activos.length > 0) {
                setSucursalId(String(activos[0].id));
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar locales");
            setLocales([]);
        } finally {
            setCargandoLocales(false);
        }
    }

    async function consultarPrestamos() {
        if (!sucursalId) return;

        try {
            const response = await fetch(
                `${API_URL}/prestamos-externos/sucursal/${sucursalId}`
            );

            if (!response.ok) {
                throw new Error("No se pudieron consultar los préstamos");
            }

            const data = await response.json();
            setPrestamos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setMensaje("Error al consultar préstamos");
            setPrestamos([]);
        }
    }

    async function buscarProductoPorCodigo(codigo) {
        const response = await fetch(`${API_URL}/productos/codigo/${codigo}`);

        if (!response.ok) {
            throw new Error("Producto no encontrado");
        }

        const data = await response.json();

        if (!data || !data.id) {
            throw new Error("Producto no encontrado");
        }

        return data;
    }

    async function validarDisponibleEnInventario(producto) {
        const response = await fetch(
            `${API_URL}/inventario/sucursal/${sucursalId}/filtro?marca=${encodeURIComponent(
                producto.marcaCelular || ""
            )}&modelo=${encodeURIComponent(producto.modeloCelular || "")}`
        );

        if (!response.ok) {
            throw new Error("No se pudo validar inventario");
        }

        const inventario = await response.json();

        const itemInv = Array.isArray(inventario)
            ? inventario.find((item) => item.codigoBarras === producto.codigoBarras)
            : null;

        if (!itemInv || Number(itemInv.cantidad || 0) <= 0) {
            throw new Error("Sin inventario disponible para esa pieza");
        }

        const yaAgregado = piezas.find(
            (item) => item.codigoBarras === producto.codigoBarras
        );

        if (yaAgregado) {
            throw new Error("Esa pieza ya fue agregada al préstamo");
        }
    }

    async function agregarPieza() {
        if (!codigoBarras.trim()) return;

        if (!sucursalId) {
            setMensaje("Selecciona una sucursal origen");
            return;
        }

        try {
            setMensaje("");

            const producto = await buscarProductoPorCodigo(codigoBarras.trim());
            await validarDisponibleEnInventario(producto);

            setPiezas((prev) => [...prev, producto]);
            setCodigoBarras("");
            inputCodigoRef.current?.focus();
        } catch (error) {
            console.error(error);
            setMensaje(error.message || "Error al agregar pieza");
        }
    }

    function quitarPieza(codigo) {
        setPiezas((prev) => prev.filter((item) => item.codigoBarras !== codigo));
        inputCodigoRef.current?.focus();
    }

    function manejarEnterCodigo(e) {
        if (e.key === "Enter") {
            agregarPieza();
        }
    }

    async function registrarPrestamo() {
        if (guardando) return;

        if (!sucursalId) {
            setMensaje("Selecciona una sucursal");
            return;
        }

        if (!numeroEmpleado.trim()) {
            setMensaje("El número de empleado es obligatorio");
            return;
        }

        if (!nombreLocalExterno.trim()) {
            setMensaje("El nombre o número del local externo es obligatorio");
            return;
        }

        if (piezas.length === 0) {
            setMensaje("Debes agregar al menos una pieza");
            return;
        }

        try {
            setGuardando(true);
            setMensaje("");

            const payload = {
                sucursalOrigenId: Number(sucursalId),
                numeroEmpleado: Number(numeroEmpleado),
                nombreLocalExterno: nombreLocalExterno.trim(),
                observacion: observacion.trim() || null,
                codigosBarras: piezas.map((item) => item.codigoBarras),
            };

            const response = await fetch(`${API_URL}/prestamos-externos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.mensaje || "Error al registrar préstamo");
            }

            if (data?.mensaje !== "Préstamo externo registrado correctamente") {
                throw new Error(data?.mensaje || "No se pudo registrar el préstamo");
            }

            setMensaje(`Préstamo registrado correctamente. Folio: ${data.folio}`);
            setNumeroEmpleado("");
            setNombreLocalExterno("");
            setObservacion("");
            setCodigoBarras("");
            setPiezas([]);

            await consultarPrestamos();
            inputCodigoRef.current?.focus();
        } catch (error) {
            console.error(error);
            setMensaje(error.message || "Error al registrar préstamo");
        } finally {
            setGuardando(false);
        }
    }

    async function abrirDetalleModal(prestamo) {
        try {
            setDetalleModalAbierto(true);
            setPrestamoSeleccionado(prestamo);
            setDetallePrestamo([]);
            setCodigoAccion("");
            setPiezaActiva(null);
            setNumeroEmpleadoVenta("");
            setMetodoPagoVenta("efectivo");
            setMensajeModal("");
            setErrorEmpleadoVenta(false);
            setCargandoDetalle(true);

            const response = await fetch(
                `${API_URL}/prestamos-externos/${prestamo.id}/detalle`
            );

            if (!response.ok) {
                throw new Error("No se pudo consultar el detalle del préstamo");
            }

            const data = await response.json();
            setDetallePrestamo(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setMensaje("Error al consultar detalle");
            cerrarDetalleModal();
        } finally {
            setCargandoDetalle(false);
            setTimeout(() => inputCodigoAccionRef.current?.focus(), 100);
        }
    }

    function cerrarDetalleModal() {
        setDetalleModalAbierto(false);
        setPrestamoSeleccionado(null);
        setDetallePrestamo([]);
        setCodigoAccion("");
        setPiezaActiva(null);
        setNumeroEmpleadoVenta("");
        setMetodoPagoVenta("efectivo");
        setMensajeModal("");
        setErrorEmpleadoVenta(false);
        setCargandoDetalle(false);
    }

    async function refrescarPrestamoSeleccionado() {
        if (!prestamoSeleccionado?.id) return;

        await consultarPrestamos();

        const responsePrestamo = await fetch(
            `${API_URL}/prestamos-externos/${prestamoSeleccionado.id}`
        );
        const prestamoActualizado = await responsePrestamo.json();

        const responseDetalle = await fetch(
            `${API_URL}/prestamos-externos/${prestamoSeleccionado.id}/detalle`
        );
        const detalleActualizado = await responseDetalle.json();

        setPrestamoSeleccionado(prestamoActualizado);
        setDetallePrestamo(Array.isArray(detalleActualizado) ? detalleActualizado : []);
    }

    async function activarPiezaEscaneada() {
        if (!codigoAccion.trim()) {
            setMensajeModal("Escanea o captura un código");
            return;
        }

        try {
            setMensajeModal("");
            setErrorEmpleadoVenta(false);

            const detalle = detallePrestamo.find(
                (item) =>
                    item.codigoBarras === codigoAccion.trim() &&
                    item.estadoDetalle === "PRESTADO"
            );

            if (!detalle) {
                throw new Error("La pieza no pertenece al préstamo o ya no está pendiente");
            }

            const producto = await buscarProductoPorCodigo(codigoAccion.trim());

            setPiezaActiva({
                detalle,
                producto,
            });
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "No se pudo activar la pieza");
            setPiezaActiva(null);
        }
    }

    function limpiarPiezaActiva() {
        setCodigoAccion("");
        setPiezaActiva(null);
        setNumeroEmpleadoVenta("");
        setMetodoPagoVenta("efectivo");
        setMensajeModal("");
        setErrorEmpleadoVenta(false);
        inputCodigoAccionRef.current?.focus();
    }

    async function devolverPiezaActiva() {
        if (!prestamoSeleccionado?.id || !piezaActiva?.detalle) {
            setMensajeModal("No hay una pieza activa seleccionada");
            return;
        }

        try {
            setProcesandoAccion(true);
            setMensajeModal("");
            setErrorEmpleadoVenta(false);

            const payload = {
                codigoBarras: piezaActiva.detalle.codigoBarras,
            };

            const response = await fetch(
                `${API_URL}/prestamos-externos/${prestamoSeleccionado.id}/devolver`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                throw new Error(texto || "Error al devolver pieza");
            }

            setMensaje(texto);
            await refrescarPrestamoSeleccionado();
            limpiarPiezaActiva();
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "Error al devolver pieza");
        } finally {
            setProcesandoAccion(false);
        }
    }

    async function venderPiezaActiva() {
        if (!prestamoSeleccionado?.id || !piezaActiva?.detalle) {
            setMensajeModal("No hay una pieza activa seleccionada");
            return;
        }

        if (!numeroEmpleadoVenta.trim()) {
            setMensajeModal("El número de empleado es obligatorio para vender");
            setErrorEmpleadoVenta(true);
            setTimeout(() => inputEmpleadoVentaRef.current?.focus(), 50);
            return;
        }

        try {
            setProcesandoAccion(true);
            setMensajeModal("");
            setErrorEmpleadoVenta(false);

            const payload = {
                numeroEmpleado: Number(numeroEmpleadoVenta),
                codigoBarras: piezaActiva.detalle.codigoBarras,
                metodoPago: metodoPagoVenta,
            };

            const response = await fetch(
                `${API_URL}/prestamos-externos/${prestamoSeleccionado.id}/vender`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                throw new Error(texto || "Error al vender pieza");
            }

            setMensaje(texto);
            await refrescarPrestamoSeleccionado();
            limpiarPiezaActiva();
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "Error al vender pieza");
        } finally {
            setProcesandoAccion(false);
        }
    }

    async function marcarFaltanteDirecto() {
        if (!prestamoSeleccionado?.id) {
            setMensajeModal("Selecciona primero un préstamo");
            return;
        }

        if (!codigoAccion.trim()) {
            setMensajeModal("Escanea o captura un código");
            return;
        }

        if (!numeroEmpleadoVenta.trim()) {
            setMensajeModal("El número de empleado es obligatorio para marcar faltante");
            setErrorEmpleadoVenta(true);
            setTimeout(() => inputEmpleadoVentaRef.current?.focus(), 50);
            return;
        }

        try {
            setProcesandoAccion(true);
            setMensajeModal("");
            setErrorEmpleadoVenta(false);

            const payload = {
                numeroEmpleado: Number(numeroEmpleadoVenta),
                codigoBarras: codigoAccion.trim(),
            };

            const response = await fetch(
                `${API_URL}/prestamos-externos/${prestamoSeleccionado.id}/faltante`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                throw new Error(texto || "Error al marcar faltante");
            }

            setMensaje(texto);
            await refrescarPrestamoSeleccionado();
            limpiarPiezaActiva();
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "Error al marcar faltante");
        } finally {
            setProcesandoAccion(false);
        }
    }

    function abrirPreviewImagen(url) {
        if (!url) return;
        setImagenPreview(url);
    }

    function cerrarPreviewImagen() {
        setImagenPreview(null);
    }

    function nombreLocalSeleccionado() {
        const local = locales.find((item) => String(item.id) === String(sucursalId));
        return local ? local.nombre : sucursalId || "-";
    }

    function contarPendientes() {
        return detallePrestamo.filter((item) => item.estadoDetalle === "PRESTADO").length;
    }

    return (
        <div style={containerStyle}>
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
                <h3 style={tituloStyle}>Nuevo préstamo externo</h3>

                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Sucursal origen</label>
                        <select
                            value={sucursalId}
                            onChange={(e) => setSucursalId(e.target.value)}
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
                        <label style={labelStyle}>Local externo</label>
                        <input
                            type="text"
                            value={nombreLocalExterno}
                            onChange={(e) => setNombreLocalExterno(e.target.value)}
                            style={inputStyle}
                            placeholder="Nombre o número del local"
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Observación</label>
                        <input
                            type="text"
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            style={inputStyle}
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                    <label style={labelStyle}>Escanear pieza</label>

                    <div style={scanRowStyle}>
                        <input
                            ref={inputCodigoRef}
                            type="text"
                            value={codigoBarras}
                            onChange={(e) => setCodigoBarras(e.target.value)}
                            onKeyDown={manejarEnterCodigo}
                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                            placeholder="Escanea código de barras"
                        />

                        <button style={buttonStyle} onClick={agregarPieza}>
                            Agregar
                        </button>
                    </div>
                </div>

                {mensaje && (
                    <p
                        style={{
                            color: mensaje.toLowerCase().includes("correctamente") ? "green" : "red",
                            fontWeight: "bold",
                            marginTop: "15px",
                        }}
                    >
                        {mensaje}
                    </p>
                )}

                <div style={{ ...cardStyle, marginTop: "20px", padding: "12px" }}>
                    <div style={resumenRowStyle}>
                        <span>
                            <b>Sucursal:</b> {nombreLocalSeleccionado()}
                        </span>
                        <span>
                            <b>Piezas agregadas:</b> {piezas.length}
                        </span>
                    </div>

                    {piezas.length === 0 ? (
                        <p style={{ margin: "12px 0 0 0" }}>No hay piezas agregadas</p>
                    ) : (
                        <div style={tablaWrapperStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Img</th>
                                        <th style={thStyle}>Código</th>
                                        <th style={thStyle}>Descripción</th>
                                        <th style={thStyle}>Marca</th>
                                        <th style={thStyle}>Modelo</th>
                                        <th style={thStyle}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {piezas.map((item) => {
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
                                                        />
                                                    ) : (
                                                        <span style={sinImagenStyle}>Sin img</span>
                                                    )}
                                                </td>

                                                <td style={tdStyle}>{item.codigoBarras}</td>
                                                <td style={tdStyle}>
                                                    <div style={descripcionStyle}>{item.descripcion}</div>
                                                </td>
                                                <td style={tdStyle}>{item.marcaCelular}</td>
                                                <td style={tdStyle}>{item.modeloCelular}</td>
                                                <td style={tdStyle}>
                                                    <button
                                                        style={{
                                                            ...buttonStyle,
                                                            backgroundColor: "#d32f2f",
                                                            padding: "6px 10px",
                                                        }}
                                                        onClick={() => quitarPieza(item.codigoBarras)}
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

                    <div style={accionesStyle}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
                            onClick={registrarPrestamo}
                            disabled={guardando || piezas.length === 0}
                        >
                            {guardando ? "Guardando..." : "Confirmar préstamo"}
                        </button>
                    </div>
                </div>
            </div>

            <div style={cardStyle}>
                <h3 style={tituloStyle}>Préstamos externos registrados</h3>

                {prestamos.length === 0 ? (
                    <p style={{ margin: 0 }}>No hay préstamos externos registrados</p>
                ) : (
                    <div style={tablaWrapperStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Folio</th>
                                    <th style={thStyle}>Local externo</th>
                                    <th style={thStyle}>Fecha</th>
                                    <th style={thStyle}>Estado</th>
                                    <th style={thStyle}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map((item) => (
                                    <tr key={item.id}>
                                        <td style={tdStyle}>{item.folio}</td>
                                        <td style={tdStyle}>{item.nombreLocalExterno}</td>
                                        <td style={tdStyle}>{formatearFechaHora(item.fechaHora)}</td>
                                        <td style={tdStyle}>{item.estado}</td>
                                        <td style={tdStyle}>
                                            <button
                                                style={{ ...buttonStyle, padding: "6px 10px" }}
                                                onClick={() => abrirDetalleModal(item)}
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {detalleModalAbierto && prestamoSeleccionado && (
                <div style={overlayStyle} onClick={cerrarDetalleModal}>
                    <div style={detalleModalStyle} onClick={(e) => e.stopPropagation()}>
                        <button style={closeButtonStyle} onClick={cerrarDetalleModal}>
                            ×
                        </button>

                        <h3 style={tituloStyle}>
                            Detalle del préstamo {prestamoSeleccionado.folio}
                        </h3>

                        <div style={detalleHeaderStyle}>
                            <span>
                                <b>Local externo:</b> {prestamoSeleccionado.nombreLocalExterno}
                            </span>
                            <span>
                                <b>Estado:</b> {prestamoSeleccionado.estado}
                            </span>
                            <span>
                                <b>Pendientes:</b> {contarPendientes()}
                            </span>
                        </div>

                        <div style={{ ...cardStyle, marginTop: "16px", padding: "12px" }}>
                            <h4 style={{ marginTop: 0, marginBottom: "12px", textAlign: "center" }}>
                                Escanear pieza pendiente
                            </h4>

                            <div style={gridStyle}>
                                <div>
                                    <label style={labelStyle}>Código de barras</label>
                                    <input
                                        ref={inputCodigoAccionRef}
                                        type="text"
                                        value={codigoAccion}
                                        onChange={(e) => setCodigoAccion(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Escanea pieza pendiente"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Número de empleado</label>
                                    <input
                                        ref={inputEmpleadoVentaRef}
                                        type="number"
                                        value={numeroEmpleadoVenta}
                                        onChange={(e) => {
                                            setNumeroEmpleadoVenta(e.target.value);
                                            if (e.target.value.trim()) {
                                                setErrorEmpleadoVenta(false);
                                            }
                                        }}
                                        style={{
                                            ...inputStyle,
                                            border: errorEmpleadoVenta ? "2px solid #d32f2f" : inputStyle.border,
                                            backgroundColor: errorEmpleadoVenta ? "#fff5f5" : "#fff",
                                        }}
                                        placeholder="Para vender o faltante"
                                    />
                                </div>
                            </div>

                            {mensajeModal && (
                                <p style={mensajeModalStyle}>{mensajeModal}</p>
                            )}

                            <div style={accionesMultiplesStyle}>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: "#455a64" }}
                                    onClick={activarPiezaEscaneada}
                                    disabled={procesandoAccion}
                                >
                                    Activar pieza
                                </button>

                                <button
                                    style={{ ...buttonStyle, backgroundColor: "#d32f2f" }}
                                    onClick={marcarFaltanteDirecto}
                                    disabled={procesandoAccion}
                                >
                                    Marcar faltante
                                </button>

                                <button
                                    style={{ ...buttonStyle, backgroundColor: "#757575" }}
                                    onClick={limpiarPiezaActiva}
                                    disabled={procesandoAccion}
                                >
                                    Limpiar selección
                                </button>
                            </div>
                        </div>

                        {cargandoDetalle ? (
                            <p>Cargando detalle...</p>
                        ) : detallePrestamo.length === 0 ? (
                            <p>No hay detalle cargado</p>
                        ) : (
                            <div style={tablaWrapperStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Código</th>
                                            <th style={thStyle}>Estado</th>
                                            <th style={thStyle}>Fecha movimiento</th>
                                            <th style={thStyle}>Observación</th>
                                            <th style={thStyle}>Venta</th>
                                            <th style={thStyle}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detallePrestamo.map((item) => {
                                            const activa =
                                                piezaActiva?.detalle?.id === item.id &&
                                                item.estadoDetalle === "PRESTADO";

                                            return (
                                                <tr
                                                    key={item.id}
                                                    style={activa ? filaActivaStyle : undefined}
                                                >
                                                    <td style={tdStyle}>{item.codigoBarras}</td>
                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            fontWeight: "bold",
                                                            color:
                                                                item.estadoDetalle === "PRESTADO"
                                                                    ? "#ef6c00"
                                                                    : item.estadoDetalle === "DEVUELTO"
                                                                        ? "#2e7d32"
                                                                        : item.estadoDetalle === "VENDIDO"
                                                                            ? "#1565c0"
                                                                            : "#c62828",
                                                        }}
                                                    >
                                                        {item.estadoDetalle}
                                                    </td>
                                                    <td style={tdStyle}>{formatearFechaHora(item.fechaMovimiento)}</td>
                                                    <td style={tdStyle}>{item.observacion || "-"}</td>
                                                    <td style={tdStyle}>{item.ventaId || "-"}</td>
                                                    <td style={tdStyle}>
                                                        {activa ? (
                                                            <div style={accionesFilaStyle}>
                                                                <button
                                                                    style={{ ...buttonStyle, padding: "6px 10px" }}
                                                                    onClick={() =>
                                                                        abrirPreviewImagen(
                                                                            piezaActiva?.producto?.imagenUrl
                                                                                ? `${API_URL}/uploads/productos/${piezaActiva.producto.imagenUrl}`
                                                                                : null
                                                                        )
                                                                    }
                                                                    disabled={!piezaActiva?.producto?.imagenUrl}
                                                                >
                                                                    Verificar pieza
                                                                </button>

                                                                <button
                                                                    style={{
                                                                        ...buttonStyle,
                                                                        backgroundColor: "#1976d2",
                                                                        padding: "6px 10px",
                                                                    }}
                                                                    onClick={venderPiezaActiva}
                                                                    disabled={procesandoAccion}
                                                                >
                                                                    Vender
                                                                </button>

                                                                <button
                                                                    style={{
                                                                        ...buttonStyle,
                                                                        backgroundColor: "#2e7d32",
                                                                        padding: "6px 10px",
                                                                    }}
                                                                    onClick={devolverPiezaActiva}
                                                                    disabled={procesandoAccion}
                                                                >
                                                                    Devolver
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span style={accionesInactivasStyle}>-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {piezaActiva && (
                            <div style={{ ...cardStyle, marginTop: "16px", padding: "12px" }}>
                                <h4 style={{ marginTop: 0, textAlign: "center" }}>
                                    Pieza activa
                                </h4>

                                <div style={piezaActivaBoxStyle}>
                                    <div>
                                        <b>Código:</b> {piezaActiva.producto?.codigoBarras}
                                    </div>
                                    <div>
                                        <b>Descripción:</b> {piezaActiva.producto?.descripcion}
                                    </div>
                                    <div>
                                        <b>Método de pago para vender:</b>
                                        <select
                                            value={metodoPagoVenta}
                                            onChange={(e) => setMetodoPagoVenta(e.target.value)}
                                            style={{ ...inputStyle, marginTop: "6px" }}
                                        >
                                            <option value="efectivo">Efectivo</option>
                                            <option value="transferencia">Transferencia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {imagenPreview && (
                <div style={overlayStyle} onClick={cerrarPreviewImagen}>
                    <div style={imageModalStyle} onClick={(e) => e.stopPropagation()}>
                        <button style={closeButtonStyle} onClick={cerrarPreviewImagen}>
                            ×
                        </button>
                        {imagenPreview ? (
                            <img
                                src={imagenPreview}
                                alt="Vista previa"
                                style={previewImageStyle}
                            />
                        ) : (
                            <div style={sinImgModalStyle}>Sin imagen</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function formatearFechaHora(valor) {
    if (!valor) return "-";
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleString("es-MX");
}

const containerStyle = {
    padding: "20px",
};

const tituloStyle = {
    marginTop: 0,
    marginBottom: "16px",
    textAlign: "center",
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
};

const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
};

const scanRowStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
};

const resumenRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
};

const detalleHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "12px",
};

const accionesStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
};

const accionesMultiplesStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "16px",
};

const accionesFilaStyle = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
};

const accionesInactivasStyle = {
    color: "#999",
};

const tablaWrapperStyle = {
    overflowX: "auto",
    marginTop: "12px",
};

const tableStyle = {
    width: "100%",
    minWidth: "900px",
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
    verticalAlign: "middle",
};

const filaActivaStyle = {
    backgroundColor: "#e8f5e9",
};

const imgStyle = {
    width: "52px",
    height: "52px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "pointer",
};

const sinImagenStyle = {
    fontSize: "11px",
    color: "#999",
};

const descripcionStyle = {
    maxWidth: "260px",
    whiteSpace: "normal",
    lineHeight: "1.3",
};

const overlayStyle = {
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

const detalleModalStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const piezaActivaBoxStyle = {
    display: "grid",
    gap: "10px",
};

const mensajeModalStyle = {
    color: "#d32f2f",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "12px",
    marginBottom: 0,
};

const sinImgModalStyle = {
    width: "260px",
    height: "260px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
    backgroundColor: "#fafafa",
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

export default PrestamoExterno;