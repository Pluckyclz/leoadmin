import { useEffect, useMemo, useState } from "react";
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

    const [mostrarModal, setMostrarModal] = useState(false);
    const [guardandoProducto, setGuardandoProducto] = useState(false);
    const [cargandoEdicion, setCargandoEdicion] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditandoId, setProductoEditandoId] = useState(null);

    const [marcasCatalogo, setMarcasCatalogo] = useState([]);
    const [modelosCatalogo, setModelosCatalogo] = useState([]);
    const [categoriasCatalogo, setCategoriasCatalogo] = useState([]);
    const [tiposFundaCatalogo, setTiposFundaCatalogo] = useState([]);
    const [generosCatalogo, setGenerosCatalogo] = useState([]);

    const [imagenFile, setImagenFile] = useState(null);

    const [formProducto, setFormProducto] = useState({
        descripcion: "",
        categoriaId: "",
        marcaId: "",
        modeloId: "",
        tipoFundaId: "",
        generoId: "",
        precioVenta: "",
        proveedor: "",
        precioProveedor: "",
        precioEspecial: "",
        cantidadInicial: "",
    });

    const totalPiezas = productos.reduce(
        (acc, p) => acc + Number(p.cantidad || 0),
        0
    );

    const modelosFiltrados = useMemo(() => {
        if (!formProducto.marcaId) return [];
        return modelosCatalogo.filter(
            (item) => String(item.marca?.id) === String(formProducto.marcaId) && item.activo
        );
    }, [modelosCatalogo, formProducto.marcaId]);

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

    const abrirPreviewImagen = (url) => {
        setImagenPreview(url);
    };

    const cerrarPreviewImagen = () => {
        setImagenPreview(null);
    };

    const resetFormProducto = () => {
        setFormProducto({
            descripcion: "",
            categoriaId: "",
            marcaId: "",
            modeloId: "",
            tipoFundaId: "",
            generoId: "",
            precioVenta: "",
            proveedor: "",
            precioProveedor: "",
            precioEspecial: "",
            cantidadInicial: "",
        });
        setImagenFile(null);
        setMensajeModal("");
        setModoEdicion(false);
        setProductoEditandoId(null);
    };

    const cargarCatalogosProducto = async () => {
        const [
            marcasRes,
            modelosRes,
            categoriasRes,
            tiposFundaRes,
            generosRes,
        ] = await Promise.all([
            fetch(`${API_URL}/catalogos/marcas`),
            fetch(`${API_URL}/catalogos/modelos`),
            fetch(`${API_URL}/catalogos/categorias`),
            fetch(`${API_URL}/catalogos/tipos-funda`),
            fetch(`${API_URL}/catalogos/generos`),
        ]);

        const [
            marcasData,
            modelosData,
            categoriasData,
            tiposFundaData,
            generosData,
        ] = await Promise.all([
            marcasRes.json(),
            modelosRes.json(),
            categoriasRes.json(),
            tiposFundaRes.json(),
            generosRes.json(),
        ]);

        const marcasActivas = (marcasData || []).filter((x) => x.activo);
        const modelosActivos = (modelosData || []).filter((x) => x.activo);
        const categoriasActivas = (categoriasData || []).filter((x) => x.activo);
        const tiposActivos = (tiposFundaData || []).filter((x) => x.activo);
        const generosActivos = (generosData || []).filter((x) => x.activo);

        setMarcasCatalogo(marcasActivas);
        setModelosCatalogo(modelosActivos);
        setCategoriasCatalogo(categoriasActivas);
        setTiposFundaCatalogo(tiposActivos);
        setGenerosCatalogo(generosActivos);

        return {
            marcasActivas,
            modelosActivos,
            categoriasActivas,
            tiposActivos,
            generosActivos,
        };
    };

    const buscarIdPorNombre = (lista, nombre) => {
        if (!nombre) return "";
        const normalizado = String(nombre).trim().toLowerCase();
        const encontrado = lista.find(
            (item) => String(item.nombre || "").trim().toLowerCase() === normalizado
        );
        return encontrado ? String(encontrado.id) : "";
    };

    const abrirModalNuevoProducto = async () => {
        resetFormProducto();
        setMostrarModal(true);

        try {
            await cargarCatalogosProducto();
        } catch (error) {
            console.error(error);
            setMensajeModal("Error al cargar catálogos");
        }
    };

    const abrirModalEditarProducto = async (productoId) => {
        resetFormProducto();
        setMostrarModal(true);
        setModoEdicion(true);
        setProductoEditandoId(productoId);
        setCargandoEdicion(true);

        try {
            const catalogos = await cargarCatalogosProducto();

            const response = await fetch(`${API_URL}/productos/${productoId}`);
            const data = await response.json();

            if (!response.ok || !data) {
                throw new Error("No se pudo cargar el producto");
            }

            const marcaIdDetectada =
                data.marca?.id
                    ? String(data.marca.id)
                    : buscarIdPorNombre(catalogos.marcasActivas, data.marcaCelular);

            const categoriaIdDetectada =
                data.categoriaObj?.id
                    ? String(data.categoriaObj.id)
                    : buscarIdPorNombre(catalogos.categoriasActivas, data.categoria);

            const tipoFundaIdDetectado =
                data.tipoFundaObj?.id
                    ? String(data.tipoFundaObj.id)
                    : buscarIdPorNombre(catalogos.tiposActivos, data.tipoFunda);

            const generoIdDetectado =
                data.generoObj?.id
                    ? String(data.generoObj.id)
                    : buscarIdPorNombre(catalogos.generosActivos, data.genero);

            const modeloIdDetectado =
                data.modelo?.id
                    ? String(data.modelo.id)
                    : (() => {
                        if (!data.modeloCelular) return "";
                        const nombreModelo = String(data.modeloCelular).trim().toLowerCase();
                        const encontrados = catalogos.modelosActivos.filter(
                            (item) =>
                                String(item.nombre || "").trim().toLowerCase() === nombreModelo
                        );

                        if (!marcaIdDetectada) {
                            return encontrados[0] ? String(encontrados[0].id) : "";
                        }

                        const porMarca = encontrados.find(
                            (item) => String(item.marca?.id) === String(marcaIdDetectada)
                        );

                        return porMarca ? String(porMarca.id) : "";
                    })();

            setFormProducto({
                descripcion: data.descripcion || "",
                categoriaId: categoriaIdDetectada,
                marcaId: marcaIdDetectada,
                modeloId: modeloIdDetectado,
                tipoFundaId: tipoFundaIdDetectado,
                generoId: generoIdDetectado,
                precioVenta: data.precioVenta ?? "",
                proveedor: data.proveedor || "",
                precioProveedor: data.precioProveedor ?? "",
                precioEspecial: data.precioEspecial ?? "",
                cantidadInicial: "",
            });
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "Error al cargar producto");
        } finally {
            setCargandoEdicion(false);
        }
    };

    const cerrarModalNuevoProducto = () => {
        setMostrarModal(false);
        resetFormProducto();
    };

    const handleFormProductoChange = (campo, valor) => {
        setFormProducto((prev) => {
            const next = { ...prev, [campo]: valor };

            if (campo === "marcaId") {
                next.modeloId = "";
            }

            return next;
        });
    };

    const validarFormularioProducto = () => {
        if (!formProducto.categoriaId) return "La categoría es obligatoria";
        if (!formProducto.marcaId) return "La marca es obligatoria";
        if (!formProducto.modeloId) return "El modelo es obligatorio";
        if (!formProducto.tipoFundaId) return "El tipo de funda es obligatorio";
        if (!formProducto.generoId) return "El género es obligatorio";
        if (!formProducto.precioVenta || Number(formProducto.precioVenta) < 0) {
            return "El precio de venta es obligatorio";
        }
        if (!formProducto.descripcion.trim()) return "La descripción es obligatoria";

        if (!modoEdicion) {
            if (!sucursalId || Number(sucursalId) <= 0) return "La sucursal es obligatoria";
            if (formProducto.cantidadInicial === "" || Number(formProducto.cantidadInicial) < 0) {
                return "La cantidad inicial es obligatoria";
            }
        }

        return "";
    };

    const obtenerUltimoProductoId = async () => {
        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No se pudo identificar el producto recién creado");
        }
        return data[data.length - 1].id;
    };

    const subirImagenProducto = async (productoId) => {
        if (!imagenFile || !productoId) return;

        const formData = new FormData();
        formData.append("file", imagenFile);

        const response = await fetch(`${API_URL}/productos/${productoId}/imagen`, {
            method: "POST",
            body: formData,
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Error al subir imagen");
        }
    };

    const guardarProductoManual = async () => {
        const errorValidacion = validarFormularioProducto();

        if (errorValidacion) {
            setMensajeModal(errorValidacion);
            return;
        }

        setGuardandoProducto(true);
        setMensajeModal("");

        try {
            const payload = {
                descripcion: formProducto.descripcion.trim(),
                categoriaId: Number(formProducto.categoriaId),
                marcaId: Number(formProducto.marcaId),
                modeloId: Number(formProducto.modeloId),
                tipoFundaId: Number(formProducto.tipoFundaId),
                generoId: Number(formProducto.generoId),
                precioVenta: Number(formProducto.precioVenta),
                proveedor: formProducto.proveedor.trim() || null,
                precioProveedor:
                    formProducto.precioProveedor !== ""
                        ? Number(formProducto.precioProveedor)
                        : null,
                precioEspecial:
                    formProducto.precioEspecial !== ""
                        ? Number(formProducto.precioEspecial)
                        : null,
                activo: true,
            };

            let response;
            let productoIdParaImagen = null;

            if (modoEdicion && productoEditandoId) {
                response = await fetch(`${API_URL}/productos/manual/${productoEditandoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                productoIdParaImagen = productoEditandoId;
            } else {
                response = await fetch(`${API_URL}/productos/manual`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...payload,
                        sucursalId: Number(sucursalId),
                        cantidadInicial: Number(formProducto.cantidadInicial),
                    }),
                });

                if (response.ok) {
                    productoIdParaImagen = await obtenerUltimoProductoId();
                }
            }

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || "Error al guardar producto");
            }

            if (imagenFile && productoIdParaImagen) {
                await subirImagenProducto(productoIdParaImagen);
            }

            setMensaje(
                modoEdicion
                    ? "Producto actualizado correctamente"
                    : "Producto creado correctamente"
            );
            cerrarModalNuevoProducto();
            await consultarInventario();
        } catch (error) {
            console.error(error);
            setMensajeModal(error.message || "Error al guardar producto");
        } finally {
            setGuardandoProducto(false);
        }
    };

    useEffect(() => {
        consultarInventario();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={container}>
            <h1 style={titleStyle}>Inventario</h1>

            <div style={filtrosCard}>
                <div style={grid}>
                    <input
                        placeholder="Sucursal"
                        value={sucursalId}
                        onChange={(e) => setSucursalId(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        placeholder="Marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        placeholder="Modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        placeholder="Género"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        placeholder="Código de barras"
                        value={codigoBarras}
                        onChange={(e) => setCodigoBarras(e.target.value)}
                        style={inputStyleFull}
                    />
                </div>

                <div style={acciones}>
                    <button style={buttonStyle} onClick={consultarInventario}>
                        Consultar
                    </button>

                    <button
                        style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
                        onClick={abrirModalNuevoProducto}
                    >
                        Nuevo producto
                    </button>

                    <button
                        style={{ ...buttonStyle, backgroundColor: "#757575" }}
                        onClick={limpiar}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {mensaje && <p style={error}>{mensaje}</p>}

            <div style={resumenBox}>
                <span>
                    <b>Resultados:</b> {productos.length}
                </span>
                <span>
                    <b>Piezas:</b> {totalPiezas}
                </span>
            </div>

            <div style={{ ...cardStyle, marginTop: "20px", padding: 0 }}>
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
                                    <th style={th}>Precio</th>
                                    <th style={th}>Stock</th>
                                    <th style={th}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((p) => {
                                    const imageUrl = p.imagenUrl
                                        ? `${API_URL}/uploads/productos/${p.imagenUrl}`
                                        : null;

                                    return (
                                        <tr key={p.productoId} style={row}>
                                            <td style={td}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        style={img}
                                                        onClick={() => abrirPreviewImagen(imageUrl)}
                                                    />
                                                ) : (
                                                    <span style={sinImg}>-</span>
                                                )}
                                            </td>

                                            <td style={td}>{p.codigoBarras}</td>

                                            <td style={td}>
                                                <div style={descripcion}>
                                                    {p.descripcion}
                                                </div>
                                            </td>

                                            <td style={td}>{p.marcaCelular}</td>
                                            <td style={td}>{p.modeloCelular}</td>
                                            <td style={td}>${p.precioVenta}</td>

                                            <td style={stockTd}>{p.cantidad}</td>

                                            <td style={td}>
                                                <button
                                                    style={smallActionButton}
                                                    onClick={() => abrirModalEditarProducto(p.productoId)}
                                                >
                                                    Editar
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

            {imagenPreview && (
                <div style={overlay} onClick={cerrarPreviewImagen}>
                    <img src={imagenPreview} style={preview} />
                </div>
            )}

            {mostrarModal && (
                <div style={modalOverlay} onClick={cerrarModalNuevoProducto}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={modalHeader}>
                            <h3 style={modalTitle}>
                                {modoEdicion ? "Editar producto" : "Nuevo producto"}
                            </h3>
                            <button
                                style={closeButton}
                                onClick={cerrarModalNuevoProducto}
                            >
                                ×
                            </button>
                        </div>

                        <div style={modalBody}>
                            {mensajeModal && (
                                <p style={modalMensajeStyle}>{mensajeModal}</p>
                            )}

                            {cargandoEdicion ? (
                                <div style={loadingBox}>Cargando producto...</div>
                            ) : (
                                <div style={modalGrid}>
                                    <select
                                        style={inputStyle}
                                        value={formProducto.categoriaId}
                                        onChange={(e) =>
                                            handleFormProductoChange("categoriaId", e.target.value)
                                        }
                                    >
                                        <option value="">Categoría</option>
                                        {categoriasCatalogo.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        style={inputStyle}
                                        value={formProducto.marcaId}
                                        onChange={(e) =>
                                            handleFormProductoChange("marcaId", e.target.value)
                                        }
                                    >
                                        <option value="">Marca</option>
                                        {marcasCatalogo.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        style={inputStyle}
                                        value={formProducto.modeloId}
                                        onChange={(e) =>
                                            handleFormProductoChange("modeloId", e.target.value)
                                        }
                                    >
                                        <option value="">Modelo</option>
                                        {modelosFiltrados.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        style={inputStyle}
                                        value={formProducto.tipoFundaId}
                                        onChange={(e) =>
                                            handleFormProductoChange("tipoFundaId", e.target.value)
                                        }
                                    >
                                        <option value="">Tipo de funda</option>
                                        {tiposFundaCatalogo.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        style={inputStyle}
                                        value={formProducto.generoId}
                                        onChange={(e) =>
                                            handleFormProductoChange("generoId", e.target.value)
                                        }
                                    >
                                        <option value="">Género</option>
                                        {generosCatalogo.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        style={inputStyle}
                                        placeholder="Precio venta"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formProducto.precioVenta}
                                        onChange={(e) =>
                                            handleFormProductoChange("precioVenta", e.target.value)
                                        }
                                    />

                                    <input
                                        style={inputStyle}
                                        placeholder="Precio especial"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formProducto.precioEspecial}
                                        onChange={(e) =>
                                            handleFormProductoChange("precioEspecial", e.target.value)
                                        }
                                    />

                                    <input
                                        style={inputStyle}
                                        placeholder="Precio proveedor"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formProducto.precioProveedor}
                                        onChange={(e) =>
                                            handleFormProductoChange("precioProveedor", e.target.value)
                                        }
                                    />

                                    <input
                                        style={inputStyle}
                                        placeholder="Proveedor"
                                        value={formProducto.proveedor}
                                        onChange={(e) =>
                                            handleFormProductoChange("proveedor", e.target.value)
                                        }
                                    />

                                    <input
                                        style={{
                                            ...inputStyle,
                                            gridColumn: "1 / -1",
                                        }}
                                        placeholder="Descripción"
                                        value={formProducto.descripcion}
                                        onChange={(e) =>
                                            handleFormProductoChange("descripcion", e.target.value)
                                        }
                                    />

                                    {!modoEdicion && (
                                        <>
                                            <input
                                                style={inputStyle}
                                                placeholder="Cantidad inicial"
                                                type="number"
                                                min="0"
                                                value={formProducto.cantidadInicial}
                                                onChange={(e) =>
                                                    handleFormProductoChange("cantidadInicial", e.target.value)
                                                }
                                            />

                                            <input
                                                style={{ ...inputStyle, backgroundColor: "#f5f5f5" }}
                                                value={`Sucursal inicial: ${sucursalId}`}
                                                readOnly
                                            />
                                        </>
                                    )}

                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label style={fileLabel}>Imagen</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={modalFooter}>
                            <button
                                style={{ ...buttonStyle, backgroundColor: "#757575" }}
                                onClick={cerrarModalNuevoProducto}
                                disabled={guardandoProducto}
                            >
                                Cancelar
                            </button>

                            <button
                                style={buttonStyle}
                                onClick={guardarProductoManual}
                                disabled={guardandoProducto || cargandoEdicion}
                            >
                                {guardandoProducto
                                    ? "Guardando..."
                                    : modoEdicion
                                        ? "Guardar cambios"
                                        : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* estilos */

const container = {
    padding: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
};

const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
};

const filtrosCard = {
    ...cardStyle,
    padding: "20px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
};

const inputStyleFull = {
    ...inputStyle,
    gridColumn: "1 / -1",
};

const acciones = {
    marginTop: "12px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
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

const error = {
    color: "red",
    textAlign: "center",
};

const tablaWrapper = {
    overflowX: "auto",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
};

const th = {
    textAlign: "left",
    padding: "8px",
    backgroundColor: "#f5f5f5",
};

const td = {
    padding: "6px 8px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const row = {
    height: "40px",
};

const img = {
    width: "32px",
    height: "32px",
    objectFit: "cover",
    borderRadius: "4px",
    cursor: "pointer",
};

const descripcion = {
    maxWidth: "220px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const stockTd = {
    ...td,
    fontWeight: "bold",
    textAlign: "center",
};

const sinImg = {
    color: "#aaa",
};

const sinResultados = {
    textAlign: "center",
    padding: "20px",
};

const smallActionButton = {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "white",
    whiteSpace: "nowrap",
};

const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const preview = {
    maxWidth: "90%",
    maxHeight: "90%",
};

const modalOverlay = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
    padding: "16px",
};

const modalStyle = {
    width: "100%",
    maxWidth: "820px",
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

const modalTitle = {
    margin: 0,
};

const modalBody = {
    padding: "16px",
};

const modalGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
};

const modalMensajeStyle = {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: "12px",
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

const loadingBox = {
    textAlign: "center",
    color: "#555",
    padding: "20px",
};

const fileLabel = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
};

export default Inventario;