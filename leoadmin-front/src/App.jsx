import { useState } from "react";
import Venta from "./Venta";
import Inventario from "./Inventario";
import EntradaInventario from "./EntradaInventario";
import AjusteInventario from "./AjusteInventario";
import Devolucion from "./Devolucion";
import Corte from "./Corte";
import Menu from "./Menu";
import TituloPantalla from "./TituloPantalla";

function App() {
  const [pantalla, setPantalla] = useState("venta");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Menu setPantalla={setPantalla} />
        <TituloPantalla pantalla={pantalla} />
        {pantalla === "venta" && <Venta />}
        {pantalla === "inventario" && <Inventario />}
        {pantalla === "entrada" && <EntradaInventario />}
        {pantalla === "ajuste" && <AjusteInventario />}
        {pantalla === "devolucion" && <Devolucion />}
        {pantalla === "corte" && <Corte />}
      </div>
    </div>
  );
}

export default App;