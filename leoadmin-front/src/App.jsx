import { useState } from "react";
import Venta from "./Venta";
import Inventario from "./Inventario";
import EntradaInventario from "./EntradaInventario";
import AjusteInventario from "./AjusteInventario";
import Devolucion from "./Devolucion";
import Corte from "./Corte";
import Menu from "./Menu";
import TituloPantalla from "./TituloPantalla";
import EmpleadosPage from "./EmpleadosPage";
import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("venta");

  return (
    <div className="app-shell">
      <div className="app-card">
        <Menu setPantalla={setPantalla} />
        <TituloPantalla pantalla={pantalla} />

        <div className="app-content">
          {pantalla === "venta" && <Venta />}
          {pantalla === "inventario" && <Inventario />}
          {pantalla === "entrada" && <EntradaInventario />}
          {pantalla === "ajuste" && <AjusteInventario />}
          {pantalla === "devolucion" && <Devolucion />}
          {pantalla === "corte" && <Corte />}
          {pantalla === "empleados" && <EmpleadosPage />}
        </div>
      </div>
    </div>
  );
}

export default App;