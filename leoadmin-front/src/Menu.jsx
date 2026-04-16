import { buttonStyle } from "./styles";

const opciones = [
  { key: "venta", label: "Venta" },
  { key: "inventario", label: "Inventario" },
  { key: "entrada", label: "Entrada" },
  { key: "ajuste", label: "Ajuste" },
  { key: "devolucion", label: "Devolución" },
  { key: "corte", label: "Corte" },
  { key: "empleados", label: "Empleados" },
];

function Menu({ setPantalla }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {opciones.map((op) => (
        <button
          key={op.key}
          style={buttonStyle}
          onClick={() => setPantalla(op.key)}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

export default Menu;