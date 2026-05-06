import { buttonStyle } from "./styles";

const opciones = [
  { key: "venta", label: "Venta", roles: ["EMPLEADO", "GERENTE", "ADMIN", "SUPER_ADMIN"] },
  { key: "devolucion", label: "Devolución", roles: ["EMPLEADO", "GERENTE", "ADMIN", "SUPER_ADMIN"] },
  { key: "prestamoExterno", label: "Préstamo Externo", roles: ["EMPLEADO", "GERENTE", "ADMIN", "SUPER_ADMIN"] },

  { key: "movimientos", label: "Movimientos", roles: ["GERENTE", "ADMIN", "SUPER_ADMIN"] },
  { key: "inventario", label: "Inventario", roles: ["GERENTE", "ADMIN", "SUPER_ADMIN"] },
  { key: "entrada", label: "Entrada", roles: ["GERENTE", "ADMIN", "SUPER_ADMIN"] },
  { key: "corte", label: "Corte", roles: ["GERENTE", "ADMIN", "SUPER_ADMIN"] },

  { key: "ajuste", label: "Ajuste", roles: ["SUPER_ADMIN"] },

  { key: "empleados", label: "Empleados", roles: ["ADMIN", "SUPER_ADMIN"] },
  { key: "catalogos", label: "Catálogos", roles: ["ADMIN", "SUPER_ADMIN"] },
];

function Menu({ setPantalla, usuario, onLogout }) {
  const rol = usuario?.rol;

  const opcionesVisibles = opciones.filter((op) => op.roles.includes(rol));

  return (
    <div>
      <div style={userBarStyle}>
        <span>
          <b>{usuario?.nombreCompleto}</b> | {usuario?.rol}
        </span>

        <button style={logoutButtonStyle} onClick={onLogout}>
          Salir
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {opcionesVisibles.map((op) => (
          <button
            key={op.key}
            style={buttonStyle}
            onClick={() => setPantalla(op.key)}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const userBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: "#f4f6f8",
  flexWrap: "wrap",
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#777",
  padding: "8px 12px",
};

export default Menu;