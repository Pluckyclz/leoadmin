import { buttonStyle } from "../styles";

export default function EmpleadosTable({
    empleados = [],
    onEdit,
    onToggleStatus,
}) {
    return (
        <div style={{ marginTop: "20px", overflowX: "auto" }}>
            <table
                style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f0f2f5" }}>
                        <th style={th}># Emp</th>
                        <th style={th}>Nombre</th>
                        <th style={th}>Rol</th>
                        <th style={th}>Zona</th>
                        <th style={th}>Login</th>
                        <th style={th}>Estatus</th>
                        <th style={th}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {empleados.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                                Sin empleados
                            </td>
                        </tr>
                    ) : (
                        empleados.map((emp) => (
                            <tr key={emp.id}>
                                <td style={td}>{emp.numeroEmpleado}</td>
                                <td style={td}>{emp.nombreCompleto}</td>
                                <td style={td}>{emp.rol}</td>
                                <td style={td}>{emp.zona}</td>
                                <td style={td}>{emp.requiereLogin ? "Sí" : "No"}</td>
                                <td style={td}>
                                    <span
                                        style={{
                                            color: emp.activo ? "green" : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {emp.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td style={td}>
                                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                        <button style={buttonStyle} onClick={() => onEdit(emp)}>
                                            Editar
                                        </button>
                                        <button
                                            style={buttonStyle}
                                            onClick={() => onToggleStatus(emp)}
                                        >
                                            {emp.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

const th = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    whiteSpace: "nowrap",
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};