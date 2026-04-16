function TituloPantalla({ pantalla }) {
  const titulos = {
    venta: "Venta",
    inventario: "Inventario",
    entrada: "Entrada de inventario",
    ajuste: "Ajuste de inventario",
    devolucion: "Devolución",
    corte: "Corte",
    empleados: "Empleados",
  };

  return <h2>{titulos[pantalla] || "Leoadmin"}</h2>;
}

export default TituloPantalla;