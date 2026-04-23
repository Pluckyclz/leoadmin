import { useState } from "react";
import Venta from "./Venta";
import Inventario from "./Inventario";
import EntradaInventario from "./EntradaInventario";
import AjusteInventario from "./AjusteInventario";
import Devolucion from "./Devolucion";
import PrestamoExterno from "./PrestamoExterno";
import Corte from "./Corte";
import Menu from "./Menu";
import TituloPantalla from "./TituloPantalla";
import EmpleadosPage from "./EmpleadosPage";
import CatalogosPage from "./CatalogosPage";
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
          {pantalla === "prestamoExterno" && <PrestamoExterno />}
          {pantalla === "corte" && <Corte />}
          {pantalla === "empleados" && <EmpleadosPage />}
          {pantalla === "catalogos" && <CatalogosPage />}
        </div>
      </div>
    </div>
  );
}

export default App;