import { useEffect, useState } from "react";
import Venta from "./Venta";
import Inventario from "./Inventario";
import EntradaInventario from "./EntradaInventario";
import AjusteInventario from "./AjusteInventario";
import Devolucion from "./Devolucion";
import PrestamoExterno from "./PrestamoExterno";
import MovimientosPage from "./MovimientosPage";
import Corte from "./Corte";
import Menu from "./Menu";
import TituloPantalla from "./TituloPantalla";
import EmpleadosPage from "./EmpleadosPage";
import CatalogosPage from "./CatalogosPage";
import LoginPage from "./LoginPage";
import "./App.css";

const PERMISOS = {
  EMPLEADO: ["venta", "devolucion", "prestamoExterno"],
  GERENTE: [
    "venta",
    "devolucion",
    "movimientos",
    "prestamoExterno",
    "inventario",
    "entrada",
    "corte",
  ],
  ADMIN: [
    "venta",
    "devolucion",
    "movimientos",
    "prestamoExterno",
    "inventario",
    "entrada",
    "corte",
    "empleados",
    "catalogos",
  ],
  SUPER_ADMIN: [
    "venta",
    "devolucion",
    "movimientos",
    "prestamoExterno",
    "inventario",
    "entrada",
    "ajuste",
    "corte",
    "empleados",
    "catalogos",
  ],
};

function obtenerPantallaInicial(rol) {
  const pantallas = PERMISOS[rol] || [];
  return pantallas[0] || "venta";
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantalla, setPantalla] = useState("venta");

  useEffect(() => {
    const guardado = localStorage.getItem("leoadmin_usuario");

    if (guardado) {
      try {
        const usuarioGuardado = JSON.parse(guardado);
        setUsuario(usuarioGuardado);
        setPantalla(obtenerPantallaInicial(usuarioGuardado.rol));
      } catch (error) {
        console.error(error);
        localStorage.removeItem("leoadmin_usuario");
      }
    }
  }, []);

  function handleLogin(usuarioLogin) {
    setUsuario(usuarioLogin);
    setPantalla(obtenerPantallaInicial(usuarioLogin.rol));
  }

  function handleLogout() {
    localStorage.removeItem("leoadmin_usuario");
    setUsuario(null);
    setPantalla("venta");
  }

  function tienePermiso(pantallaActual) {
    if (!usuario?.rol) return false;
    return (PERMISOS[usuario.rol] || []).includes(pantallaActual);
  }

  function cambiarPantalla(nuevaPantalla) {
    if (tienePermiso(nuevaPantalla)) {
      setPantalla(nuevaPantalla);
    } else {
      setPantalla(obtenerPantallaInicial(usuario.rol));
    }
  }

  if (!usuario) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <div className="app-card">
        <Menu
          setPantalla={cambiarPantalla}
          usuario={usuario}
          onLogout={handleLogout}
        />

        <TituloPantalla pantalla={pantalla} />

        <div className="app-content">
          {pantalla === "venta" && tienePermiso("venta") && <Venta />}
          {pantalla === "inventario" && tienePermiso("inventario") && <Inventario />}
          {pantalla === "entrada" && tienePermiso("entrada") && <EntradaInventario />}
          {pantalla === "ajuste" && tienePermiso("ajuste") && <AjusteInventario />}
          {pantalla === "devolucion" && tienePermiso("devolucion") && <Devolucion />}
          {pantalla === "prestamoExterno" && tienePermiso("prestamoExterno") && <PrestamoExterno />}
          {pantalla === "movimientos" && tienePermiso("movimientos") && <MovimientosPage />}
          {pantalla === "corte" && tienePermiso("corte") && <Corte />}
          {pantalla === "empleados" && tienePermiso("empleados") && <EmpleadosPage />}
          {pantalla === "catalogos" && tienePermiso("catalogos") && <CatalogosPage />}
        </div>
      </div>
    </div>
  );
}

export default App;