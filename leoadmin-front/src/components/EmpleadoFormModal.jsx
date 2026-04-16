import { useEffect, useState } from "react";
import { buttonStyle } from "../styles";

const initialForm = {
    nombreCompleto: "",
    password: "",
    confirmarPassword: "",
    numeroEmpleado: "",
    rol: "",
    zona: "",
    requiereLogin: false,
    telefono: "",
    email: "",
    activo: true,
};

export default function EmpleadoFormModal({
    open,
    onClose,
    onSubmit,
    empleadoEdit,
    roles = [],
    mensaje = "",
    error = false,
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!open) return;

        if (empleadoEdit) {
            setForm({
                nombreCompleto: empleadoEdit.nombreCompleto || "",
                password: "",
                confirmarPassword: "",
                numeroEmpleado: empleadoEdit.numeroEmpleado || "",
                rol: empleadoEdit.rol || "",
                zona: empleadoEdit.zona || "",
                requiereLogin: empleadoEdit.requiereLogin || false,
                telefono: empleadoEdit.telefono || "",
                email: empleadoEdit.email || "",
                activo: empleadoEdit.activo ?? true,
            });
        } else {
            setForm(initialForm);
        }
    }, [empleadoEdit, open]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!form.nombreCompleto.trim()) {
            alert("Nombre obligatorio");
            return;
        }

        if (!form.numeroEmpleado) {
            alert("Número de empleado obligatorio");
            return;
        }

        if (!form.rol) {
            alert("Rol obligatorio");
            return;
        }

        if (!form.zona) {
            alert("Zona obligatoria");
            return;
        }

        if (form.requiereLogin) {
            if (!form.password) {
                alert("Contraseña obligatoria");
                return;
            }

            if (form.password !== form.confirmarPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }
        }

        const payload = {
            ...form,
            numeroEmpleado: Number(form.numeroEmpleado),
        };

        onSubmit(payload);
    }

    if (!open) return null;

    return (
        <div style={overlay}>
            <div style={modal}>
                <h3>{empleadoEdit ? "Editar empleado" : "Nuevo empleado"}</h3>

                {mensaje && (
                    <p
                        style={{
                            color: error ? "red" : "green",
                            fontWeight: "bold",
                            marginBottom: "10px",
                        }}
                    >
                        {mensaje}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                    <input
                        name="nombreCompleto"
                        placeholder="Nombre completo"
                        value={form.nombreCompleto}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="numeroEmpleado"
                        placeholder="Número de empleado"
                        value={form.numeroEmpleado}
                        onChange={handleChange}
                    />

                    <select name="rol" value={form.rol} onChange={handleChange}>
                        <option value="">Selecciona rol</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.nombre}>
                                {r.nombre}
                            </option>
                        ))}
                    </select>

                    <select name="zona" value={form.zona} onChange={handleChange}>
                        <option value="">Selecciona zona</option>
                        <option value="SANTA_MARTHA">Santa Martha</option>
                        <option value="CHALCO">Chalco</option>
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="requiereLogin"
                            checked={form.requiereLogin}
                            onChange={handleChange}
                        />
                        Requiere acceso al sistema
                    </label>

                    {form.requiereLogin && (
                        <>
                            <input
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={form.password}
                                onChange={handleChange}
                            />

                            <input
                                type="password"
                                name="confirmarPassword"
                                placeholder="Confirmar contraseña"
                                value={form.confirmarPassword}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                        Activo
                    </label>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button type="submit" style={buttonStyle}>
                            Guardar
                        </button>

                        <button type="button" style={buttonStyle} onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modal = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
};