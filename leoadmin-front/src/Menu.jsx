import { buttonStyle } from "./styles";

function Menu({ setPantalla }) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button style={buttonStyle} onClick={() => setPantalla("venta")}>Venta</button>
      <button style={buttonStyle} onClick={() => setPantalla("inventario")}>Inventario</button>
      <button style={buttonStyle} onClick={() => setPantalla("entrada")}>Entrada</button>
      <button style={buttonStyle} onClick={() => setPantalla("ajuste")}>Ajuste</button>
      <button style={buttonStyle} onClick={() => setPantalla("devolucion")}>Devolución</button>
      <button style={buttonStyle} onClick={() => setPantalla("corte")}>Corte</button>
    </div>
  );
}

export default Menu;