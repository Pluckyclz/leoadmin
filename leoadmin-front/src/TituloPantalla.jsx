function TituloPantalla({ pantalla }) {
  const titulos = {
    venta: "Venta",
    inventario: "Inventario",
    entrada: "Entrada de inventario",
    ajuste: "Ajuste de inventario",
    devolucion: "Devolución",
    prestamoExterno: "Préstamo Externo",
    corte: "Corte",
    empleados: "Empleados",
    catalogos: "Catálogos",
  };

  return <h2>{titulos[pantalla] || "Leoadmin"}</h2>;
}

export default TituloPantalla;