import { useEffect, useMemo, useState } from "react";
import { API_URL } from "./config";
import { cardStyle, buttonStyle, inputStyle } from "./styles";

const tabs = [
    { key: "marcas", label: "Marcas" },
    { key: "modelos", label: "Modelos" },
    { key: "categorias", label: "Categorías" },
    { key: "tiposFunda", label: "Tipos de funda" },
    { key: "generos", label: "Géneros" },
    { key: "locales", label: "Locales" },
];

const zonasUsuario = [
    { value: "SANTA_MARTHA", label: "SANTA_MARTHA" },
    { value: "CHALCO", label: "CHALCO" },
];

function CatalogosPage() {
    const [catalogoActivo, setCatalogoActivo] = useState("marcas");

    const [items, setItems] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [itemEditando, setItemEditando] = useState(null);

    const [nombre, setNombre] = useState("");
    const [marcaId, setMarcaId] = useState("");
    const [zona, setZona] = useState("");
    const [ip, setIp] = useState("");

    const esMarcas = catalogoActivo === "marcas";
    const esModelos = catalogoActivo === "modelos";
    const esCategorias = catalogoActivo === "categorias";
    const esTiposFunda = catalogoActivo === "tiposFunda";
    const esGeneros = catalogoActivo === "generos";
    const esLocales = catalogoActivo === "locales";

    useEffect(() => {
        if (esMarcas) {
            cargarMarcas();
            return;
        }

        if (esModelos) {
            cargarMarcasParaModelos();
            cargarModelos();
            return;
        }

        if (esCategorias) {
            cargarCategorias();
            return;
        }

        if (esTiposFunda) {
            cargarTiposFunda();
            return;
        }

        if (esGeneros) {
            cargarGeneros();
            return;
        }

        if (esLocales) {
            cargarLocales();
            return;
        }

        setItems([]);
        setMensaje("Este catálogo lo conectaremos después.");
    }, [catalogoActivo]);

    const itemsFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        if (!texto) return items;

        if (esModelos) {
            return items.filter((item) => {
                const nombreModelo = (item.nombre || "").toLowerCase();
                const nombreMarca = (item.marca?.nombre || "").toLowerCase();
                return nombreModelo.includes(texto) || nombreMarca.includes(texto);
            });
        }

        if (esLocales) {
            return items.filter((item) => {
                const nombreLocal = (item.nombre || "").toLowerCase();
                const zonaLocal = (item.zona || "").toLowerCase();
                const ipLocal = (item.ip || "").toLowerCase();
                return (
                    nombreLocal.includes(texto) ||
                    zonaLocal.includes(texto) ||
                    ipLocal.includes(texto)
                );
            });
        }

        return items.filter((item) =>
            (item.nombre || "").toLowerCase().includes(texto)
        );
    }, [items, busqueda, esModelos, esLocales]);

    const cargarMarcas = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/marcas`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar las marcas");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar marcas");
        } finally {
            setLoading(false);
        }
    };

    const cargarMarcasParaModelos = async () => {
        try {
            const response = await fetch(`${API_URL}/catalogos/marcas`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar las marcas");
            }

            const data = await response.json();
            setMarcas(data.filter((item) => item.activo));
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar marcas");
        }
    };

    const cargarModelos = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/modelos`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los modelos");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar modelos");
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/categorias`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar las categorías");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    const cargarTiposFunda = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/tipos-funda`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los tipos de funda");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar tipos de funda");
        } finally {
            setLoading(false);
        }
    };

    const cargarGeneros = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/generos`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los géneros");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar géneros");
        } finally {
            setLoading(false);
        }
    };

    const cargarLocales = async () => {
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/catalogos/locales`);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los locales");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar locales");
        } finally {
            setLoading(false);
        }
    };

    const abrirNuevo = () => {
        setModoEdicion(false);
        setItemEditando(null);
        setNombre("");
        setMarcaId("");
        setZona("");
        setIp("");
        setMostrarModal(true);
    };

    const abrirEditar = (item) => {
        setModoEdicion(true);
        setItemEditando(item);
        setNombre(item.nombre || "");
        setMarcaId(item.marca?.id ? String(item.marca.id) : "");
        setZona(item.zona || "");
        setIp(item.ip || "");
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setModoEdicion(false);
        setItemEditando(null);
        setNombre("");
        setMarcaId("");
        setZona("");
        setIp("");
    };

    const guardar = async () => {
        if (!nombre.trim()) {
            setMensaje("El nombre es obligatorio");
            return;
        }

        if (esModelos && !marcaId) {
            setMensaje("La marca es obligatoria");
            return;
        }

        if (esLocales && !zona) {
            setMensaje("La zona es obligatoria");
            return;
        }

        setMensaje("");

        try {
            if (esMarcas) {
                await guardarMarca();
            } else if (esModelos) {
                await guardarModelo();
            } else if (esCategorias) {
                await guardarCategoria();
            } else if (esTiposFunda) {
                await guardarTipoFunda();
            } else if (esGeneros) {
                await guardarGenero();
            } else if (esLocales) {
                await guardarLocal();
            }

            cerrarModal();

            if (esMarcas) {
                await cargarMarcas();
                setMensaje(modoEdicion ? "Marca actualizada correctamente" : "Marca creada correctamente");
            }

            if (esModelos) {
                await cargarModelos();
                setMensaje(modoEdicion ? "Modelo actualizado correctamente" : "Modelo creado correctamente");
            }

            if (esCategorias) {
                await cargarCategorias();
                setMensaje(modoEdicion ? "Categoría actualizada correctamente" : "Categoría creada correctamente");
            }

            if (esTiposFunda) {
                await cargarTiposFunda();
                setMensaje(modoEdicion ? "Tipo de funda actualizado correctamente" : "Tipo de funda creado correctamente");
            }

            if (esGeneros) {
                await cargarGeneros();
                setMensaje(modoEdicion ? "Género actualizado correctamente" : "Género creado correctamente");
            }

            if (esLocales) {
                await cargarLocales();
                setMensaje(modoEdicion ? "Local actualizado correctamente" : "Local creado correctamente");
            }
        } catch (error) {
            console.error(error);
            setMensaje(extraerMensaje(error.message, "Error al guardar"));
        }
    };

    const guardarMarca = async () => {
        let response;

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/marcas/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: itemEditando.activo,
                }),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/marcas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: true,
                }),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar la marca");
        }
    };

    const guardarModelo = async () => {
        let response;

        const payload = {
            nombre: nombre.trim(),
            activo: modoEdicion && itemEditando ? itemEditando.activo : true,
            marca: {
                id: Number(marcaId),
            },
        };

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/modelos/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/modelos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar el modelo");
        }
    };

    const guardarCategoria = async () => {
        let response;

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/categorias/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: itemEditando.activo,
                }),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/categorias`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: true,
                }),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar la categoría");
        }
    };

    const guardarTipoFunda = async () => {
        let response;

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/tipos-funda/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: itemEditando.activo,
                }),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/tipos-funda`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: true,
                }),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar el tipo de funda");
        }
    };

    const guardarGenero = async () => {
        let response;

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/generos/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: itemEditando.activo,
                }),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/generos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    activo: true,
                }),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar el género");
        }
    };

    const guardarLocal = async () => {
        let response;

        const payload = {
            nombre: nombre.trim(),
            zona,
            ip: ip.trim(),
            activo: modoEdicion && itemEditando ? itemEditando.activo : true,
        };

        if (modoEdicion && itemEditando) {
            response = await fetch(`${API_URL}/catalogos/locales/${itemEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } else {
            response = await fetch(`${API_URL}/catalogos/locales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        }

        if (!response.ok) {
            const texto = await response.text();
            throw new Error(texto || "No se pudo guardar el local");
        }
    };

    const cambiarActivo = async (item) => {
        const nuevoActivo = !item.activo;

        try {
            let url = "";

            if (esMarcas) {
                url = `${API_URL}/catalogos/marcas/${item.id}/activo?activo=${nuevoActivo}`;
            } else if (esModelos) {
                url = `${API_URL}/catalogos/modelos/${item.id}/activo?activo=${nuevoActivo}`;
            } else if (esCategorias) {
                url = `${API_URL}/catalogos/categorias/${item.id}/activo?activo=${nuevoActivo}`;
            } else if (esTiposFunda) {
                url = `${API_URL}/catalogos/tipos-funda/${item.id}/activo?activo=${nuevoActivo}`;
            } else if (esGeneros) {
                url = `${API_URL}/catalogos/generos/${item.id}/activo?activo=${nuevoActivo}`;
            } else if (esLocales) {
                url = `${API_URL}/catalogos/locales/${item.id}/activo?activo=${nuevoActivo}`;
            } else {
                return;
            }

            const response = await fetch(url, {
                method: "PATCH",
            });

            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "No se pudo actualizar el estatus");
            }

            if (esMarcas) {
                await cargarMarcas();
                setMensaje(
                    nuevoActivo ? "Marca activada correctamente" : "Marca desactivada correctamente"
                );
            }

            if (esModelos) {
                await cargarModelos();
                setMensaje(
                    nuevoActivo ? "Modelo activado correctamente" : "Modelo desactivado correctamente"
                );
            }

            if (esCategorias) {
                await cargarCategorias();
                setMensaje(
                    nuevoActivo ? "Categoría activada correctamente" : "Categoría desactivada correctamente"
                );
            }

            if (esTiposFunda) {
                await cargarTiposFunda();
                setMensaje(
                    nuevoActivo ? "Tipo de funda activado correctamente" : "Tipo de funda desactivado correctamente"
                );
            }

            if (esGeneros) {
                await cargarGeneros();
                setMensaje(
                    nuevoActivo ? "Género activado correctamente" : "Género desactivado correctamente"
                );
            }

            if (esLocales) {
                await cargarLocales();
                setMensaje(
                    nuevoActivo ? "Local activado correctamente" : "Local desactivado correctamente"
                );
            }
        } catch (error) {
            console.error(error);
            setMensaje(extraerMensaje(error.message, "Error al actualizar estatus"));
        }
    };

    const esCatalogoSimple = esMarcas || esCategorias || esTiposFunda || esGeneros;

    return (
        <div style={container}>
            <div style={tabsWrapper}>
                {tabs.map((tab) => {
                    const activo = catalogoActivo === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setCatalogoActivo(tab.key)}
                            style={{
                                ...buttonStyle,
                                opacity: activo ? 1 : 0.75,
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div style={cardStyle}>
                <div style={headerRow}>
                    <h3 style={titleStyle}>{obtenerTitulo(catalogoActivo)}</h3>

                    <button
                        style={buttonStyle}
                        onClick={abrirNuevo}
                        disabled={!esMarcas && !esModelos && !esCategorias && !esTiposFunda && !esGeneros && !esLocales}
                    >
                        Nuevo
                    </button>
                </div>

                <div style={filtrosRow}>
                    <input
                        style={inputStyle}
                        placeholder={
                            esModelos
                                ? "Buscar por modelo o marca..."
                                : esLocales
                                    ? "Buscar por nombre, zona o IP..."
                                    : "Buscar por nombre..."
                        }
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {mensaje && <p style={mensajeStyle}>{mensaje}</p>}

                {!esMarcas && !esModelos && !esCategorias && !esTiposFunda && !esGeneros && !esLocales ? (
                    <div style={placeholderBox}>
                        Este catálogo lo conectaremos después.
                    </div>
                ) : loading ? (
                    <div style={placeholderBox}>Cargando...</div>
                ) : (
                    <div style={tableWrapper}>
                        {esCatalogoSimple && (
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={{ ...th, width: "80px", textAlign: "center" }}>ID</th>
                                        <th style={th}>Nombre</th>
                                        <th style={{ ...th, width: "120px", textAlign: "center" }}>Activo</th>
                                        <th style={{ ...th, width: "220px", textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={emptyCell}>
                                                Sin registros
                                            </td>
                                        </tr>
                                    ) : (
                                        itemsFiltrados.map((item) => (
                                            <tr key={item.id}>
                                                <td style={{ ...td, textAlign: "center" }}>{item.id}</td>
                                                <td style={td}>{item.nombre}</td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <span style={item.activo ? badgeActivo : badgeInactivo}>
                                                        {item.activo ? "Sí" : "No"}
                                                    </span>
                                                </td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <div style={accionesTabla}>
                                                        <button
                                                            style={smallButton}
                                                            onClick={() => abrirEditar(item)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            style={{
                                                                ...smallButton,
                                                                backgroundColor: item.activo ? "#757575" : "#2e7d32",
                                                            }}
                                                            onClick={() => cambiarActivo(item)}
                                                        >
                                                            {item.activo ? "Desactivar" : "Activar"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {esModelos && (
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={{ ...th, width: "80px", textAlign: "center" }}>ID</th>
                                        <th style={th}>Nombre</th>
                                        <th style={th}>Marca</th>
                                        <th style={{ ...th, width: "120px", textAlign: "center" }}>Activo</th>
                                        <th style={{ ...th, width: "220px", textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={emptyCell}>
                                                Sin registros
                                            </td>
                                        </tr>
                                    ) : (
                                        itemsFiltrados.map((item) => (
                                            <tr key={item.id}>
                                                <td style={{ ...td, textAlign: "center" }}>{item.id}</td>
                                                <td style={td}>{item.nombre}</td>
                                                <td style={td}>{item.marca?.nombre || "-"}</td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <span style={item.activo ? badgeActivo : badgeInactivo}>
                                                        {item.activo ? "Sí" : "No"}
                                                    </span>
                                                </td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <div style={accionesTabla}>
                                                        <button
                                                            style={smallButton}
                                                            onClick={() => abrirEditar(item)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            style={{
                                                                ...smallButton,
                                                                backgroundColor: item.activo ? "#757575" : "#2e7d32",
                                                            }}
                                                            onClick={() => cambiarActivo(item)}
                                                        >
                                                            {item.activo ? "Desactivar" : "Activar"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {esLocales && (
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={{ ...th, width: "80px", textAlign: "center" }}>ID</th>
                                        <th style={th}>Nombre</th>
                                        <th style={{ ...th, width: "170px" }}>Zona</th>
                                        <th style={{ ...th, width: "180px" }}>IP</th>
                                        <th style={{ ...th, width: "120px", textAlign: "center" }}>Activo</th>
                                        <th style={{ ...th, width: "220px", textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={emptyCell}>
                                                Sin registros
                                            </td>
                                        </tr>
                                    ) : (
                                        itemsFiltrados.map((item) => (
                                            <tr key={item.id}>
                                                <td style={{ ...td, textAlign: "center" }}>{item.id}</td>
                                                <td style={td}>{item.nombre}</td>
                                                <td style={td}>{item.zona || "-"}</td>
                                                <td style={td}>{item.ip || "-"}</td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <span style={item.activo ? badgeActivo : badgeInactivo}>
                                                        {item.activo ? "Sí" : "No"}
                                                    </span>
                                                </td>
                                                <td style={{ ...td, textAlign: "center" }}>
                                                    <div style={accionesTabla}>
                                                        <button
                                                            style={smallButton}
                                                            onClick={() => abrirEditar(item)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            style={{
                                                                ...smallButton,
                                                                backgroundColor: item.activo ? "#757575" : "#2e7d32",
                                                            }}
                                                            onClick={() => cambiarActivo(item)}
                                                        >
                                                            {item.activo ? "Desactivar" : "Activar"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {mostrarModal && (
                <div style={overlayStyle} onClick={cerrarModal}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={modalHeader}>
                            <h3 style={{ margin: 0 }}>
                                {modoEdicion
                                    ? `Editar ${obtenerNombreSingular(catalogoActivo)}`
                                    : `Nuevo ${obtenerNombreSingular(catalogoActivo)}`}
                            </h3>
                            <button style={closeButton} onClick={cerrarModal}>
                                ×
                            </button>
                        </div>

                        <div style={modalBody}>
                            {esModelos && (
                                <>
                                    <label style={labelStyle}>Marca</label>
                                    <select
                                        style={inputStyle}
                                        value={marcaId}
                                        onChange={(e) => setMarcaId(e.target.value)}
                                    >
                                        <option value="">Selecciona una marca</option>
                                        {marcas.map((marca) => (
                                            <option key={marca.id} value={marca.id}>
                                                {marca.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {esLocales && (
                                <>
                                    <label style={labelStyle}>Zona</label>
                                    <select
                                        style={inputStyle}
                                        value={zona}
                                        onChange={(e) => setZona(e.target.value)}
                                    >
                                        <option value="">Selecciona una zona</option>
                                        {zonasUsuario.map((zonaItem) => (
                                            <option key={zonaItem.value} value={zonaItem.value}>
                                                {zonaItem.label}
                                            </option>
                                        ))}
                                    </select>

                                    <label style={labelStyle}>IP</label>
                                    <input
                                        style={inputStyle}
                                        value={ip}
                                        onChange={(e) => setIp(e.target.value)}
                                        placeholder="Ej. 192.168.1.10"
                                    />
                                </>
                            )}

                            <label style={labelStyle}>Nombre</label>
                            <input
                                style={inputStyle}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder={
                                    esModelos
                                        ? "Ej. iPhone 14"
                                        : esCategorias
                                            ? "Ej. FUNDA"
                                            : esTiposFunda
                                                ? "Ej. SILICONA"
                                                : esGeneros
                                                    ? "Ej. DAMA"
                                                    : esLocales
                                                        ? "Ej. Local Centro"
                                                        : "Ej. Apple"
                                }
                            />
                        </div>

                        <div style={modalFooter}>
                            <button
                                style={{ ...buttonStyle, backgroundColor: "#757575" }}
                                onClick={cerrarModal}
                            >
                                Cancelar
                            </button>

                            <button style={buttonStyle} onClick={guardar}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function obtenerTitulo(catalogo) {
    const mapa = {
        marcas: "Marcas",
        modelos: "Modelos",
        categorias: "Categorías",
        tiposFunda: "Tipos de funda",
        generos: "Géneros",
        locales: "Locales",
    };

    return mapa[catalogo] || "Catálogos";
}

function obtenerNombreSingular(catalogo) {
    const mapa = {
        marcas: "marca",
        modelos: "modelo",
        categorias: "categoría",
        tiposFunda: "tipo de funda",
        generos: "género",
        locales: "local",
    };

    return mapa[catalogo] || "registro";
}

function extraerMensaje(texto, fallback) {
    if (!texto) return fallback;
    if (texto.includes("Ya existe una marca")) return "Ya existe una marca con ese nombre";
    if (texto.includes("Ya existe un modelo")) return "Ya existe un modelo con ese nombre para la marca";
    if (texto.includes("Ya existe una categoría")) return "Ya existe una categoría con ese nombre";
    if (texto.includes("Ya existe un tipo de funda")) return "Ya existe un tipo de funda con ese nombre";
    if (texto.includes("Ya existe un género")) return "Ya existe un género con ese nombre";
    if (texto.includes("La marca es obligatoria")) return "La marca es obligatoria";
    if (texto.includes("Marca no encontrada")) return "La marca seleccionada no existe";
    if (texto.includes("El nombre es obligatorio")) return "El nombre es obligatorio";
    return fallback;
}

const container = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const tabsWrapper = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
};

const headerRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
};

const filtrosRow = {
    marginBottom: "16px",
};

const titleStyle = {
    margin: 0,
};

const mensajeStyle = {
    textAlign: "center",
    fontWeight: "bold",
};

const placeholderBox = {
    border: "1px dashed #bbb",
    borderRadius: "8px",
    padding: "24px",
    backgroundColor: "#fafafa",
    textAlign: "center",
    color: "#555",
};

const tableWrapper = {
    overflowX: "auto",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
};

const th = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #eee",
};

const emptyCell = {
    padding: "20px",
    textAlign: "center",
    color: "#666",
};

const accionesTabla = {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
};

const smallButton = {
    padding: "8px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "white",
    whiteSpace: "nowrap",
};

const badgeActivo = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: "12px",
};

const badgeInactivo = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    fontWeight: "bold",
    fontSize: "12px",
};

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    padding: "16px",
};

const modalStyle = {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const modalHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #eee",
};

const modalBody = {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const modalFooter = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "16px",
    borderTop: "1px solid #eee",
    flexWrap: "wrap",
};

const closeButton = {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    lineHeight: 1,
};

const labelStyle = {
    display: "block",
    fontWeight: "bold",
};

export default CatalogosPage;