import { useEffect, useState } from "react";

export default function EmpleadoFormModal({
    open,
    onClose,
    onSubmit,
    empleadoEdit,
    roles,
    mensaje,
    error,
}) {
    const [form, setForm] = useState({
        nombre: "",
        numeroEmpleado: "",
        rol: "",
        zona: "",
        requiereLogin: false,
        password: "",
        telefono: "",
        correo: "",
        activo: true,
    });

    useEffect(() => {
        if (empleadoEdit) {
            setForm({
                nombre: empleadoEdit.nombreCompleto || empleadoEdit.nombre || "",
                numeroEmpleado: empleadoEdit.numeroEmpleado || "",
                rol: empleadoEdit.rol || "",
                zona: empleadoEdit.zona || "",
                requiereLogin: empleadoEdit.requiereLogin || false,
                password: "",
                telefono: empleadoEdit.telefono || "",
                correo: empleadoEdit.email || empleadoEdit.correo || "",
                activo: empleadoEdit.activo ?? true,
            });
        } else {
            setForm({
                nombre: "",
                numeroEmpleado: "",
                rol: "",
                zona: "",
                requiereLogin: false,
                password: "",
                telefono: "",
                correo: "",
                activo: true,
            });
        }
    }, [empleadoEdit, open]);

    if (!open) return null;

    function normalizarRol(rol) {
        if (!rol) return "";
        return rol.trim().toUpperCase().replaceAll(" ", "_");
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function handleSubmit() {
        const payload = {
            nombreCompleto: form.nombre,
            numeroEmpleado: form.numeroEmpleado ? Number(form.numeroEmpleado) : null,
            rol: normalizarRol(form.rol),
            zona: form.zona,
            requiereLogin: form.requiereLogin,
            password: form.password,
            telefono: form.telefono,
            email: form.correo,
            activo: form.activo,
        };

        onSubmit(payload);
    }

    return (
        <div style={overlay}>
            <div style={modal}>
                <h2 style={titleStyle}>
                    {empleadoEdit ? "Editar empleado" : "Nuevo empleado"}
                </h2>

                {mensaje && (
                    <p style={{ ...messageStyle, color: error ? "red" : "green" }}>
                        {mensaje}
                    </p>
                )}

                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Nombre</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Número de empleado</label>
                        <input
                            name="numeroEmpleado"
                            value={form.numeroEmpleado}
                            onChange={handleChange}
                            placeholder="Ej. 1001"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Rol</label>
                        <select
                            name="rol"
                            value={form.rol}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="">Selecciona rol</option>
                            {roles.map((r) => (
                                <option key={r.value || r.nombre} value={r.value || r.nombre}>
                                    {r.label || r.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Zona</label>
                        <select
                            name="zona"
                            value={form.zona}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="">Selecciona zona</option>
                            <option value="CHALCO">Chalco</option>
                            <option value="SANTA_MARTHA">Santa Martha</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={checkboxStyle}>
                            <input
                                type="checkbox"
                                name="requiereLogin"
                                checked={form.requiereLogin}
                                onChange={handleChange}
                            />
                            Requiere acceso al sistema
                        </label>
                    </div>

                    {form.requiereLogin && (
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                style={inputStyle}
                            />
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Correo</label>
                        <input
                            name="correo"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="Correo"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={checkboxStyle}>
                            <input
                                type="checkbox"
                                name="activo"
                                checked={form.activo}
                                onChange={handleChange}
                            />
                            Activo
                        </label>
                    </div>
                </div>

                <div style={buttonRowStyle}>
                    <button style={saveButtonStyle} onClick={handleSubmit}>
                        Guardar
                    </button>

                    <button style={cancelButtonStyle} onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
};

const modal = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "760px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const titleStyle = {
    marginTop: 0,
    marginBottom: "18px",
    textAlign: "center",
    color: "#5f5870",
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
};

const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
};

const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
};

const buttonRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "22px",
};

const saveButtonStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
};

const cancelButtonStyle = {
    backgroundColor: "#777",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
};

const messageStyle = {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: "14px",
};