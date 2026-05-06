import { useState } from "react";
import { API_URL } from "./config";
import { inputStyle, buttonStyle, cardStyle } from "./styles";

function LoginPage({ onLogin }) {
    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    async function iniciarSesion() {
        if (!numeroEmpleado.trim()) {
            setMensaje("El número de empleado es obligatorio");
            return;
        }

        try {
            setCargando(true);
            setMensaje("");

            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    numeroEmpleado: Number(numeroEmpleado),
                    password: password.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.mensaje || "No se pudo iniciar sesión");
                return;
            }

            localStorage.setItem("leoadmin_usuario", JSON.stringify(data));
            onLogin(data);
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con backend");
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="app-shell">
            <div style={loginCardStyle}>
                <h1 style={titleStyle}>Leoadmin</h1>
                <h2 style={subtitleStyle}>Inicio de sesión</h2>

                <div style={formStyle}>
                    <div>
                        <label style={labelStyle}>Número de empleado</label>
                        <input
                            value={numeroEmpleado}
                            onChange={(e) => {
                                setNumeroEmpleado(e.target.value);
                                setMensaje("");
                            }}
                            style={inputStyle}
                            placeholder="Ej. 1"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setMensaje("");
                            }}
                            style={inputStyle}
                            placeholder="Solo gerente, admin o super admin"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") iniciarSesion();
                            }}
                        />
                    </div>
                </div>

                {mensaje && <p style={errorStyle}>{mensaje}</p>}

                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={iniciarSesion} disabled={cargando}>
                        {cargando ? "Entrando..." : "Entrar"}
                    </button>
                </div>

                <p style={notaStyle}>
                    Los empleados pueden entrar solo con su número. Gerente, Admin y
                    Super Admin requieren contraseña.
                </p>
            </div>
        </div>
    );
}

const loginCardStyle = {
    ...cardStyle,
    maxWidth: "460px",
    margin: "80px auto",
    padding: "28px",
};

const titleStyle = {
    textAlign: "center",
    margin: "0 0 8px 0",
};

const subtitleStyle = {
    textAlign: "center",
    margin: "0 0 24px 0",
};

const formStyle = {
    display: "grid",
    gap: "14px",
};

const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
};

const errorStyle = {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
};

const notaStyle = {
    marginTop: "18px",
    fontSize: "13px",
    textAlign: "center",
    color: "#666",
};

export default LoginPage;