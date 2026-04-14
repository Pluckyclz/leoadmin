package com.leoadmin.v1.dto;

import java.util.List;

public class VentaRequest {

    private Integer sucursalId;
    private String numeroEmpleado;
    private String tipoVenta;
    private List<DetalleVentaRequest> productos;

    public Integer getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(Integer sucursalId) {
        this.sucursalId = sucursalId;
    }

    public String getNumeroEmpleado() {
        return numeroEmpleado;
    }

    public void setNumeroEmpleado(String numeroEmpleado) {
        this.numeroEmpleado = numeroEmpleado;
    }

    public String getTipoVenta() {
        return tipoVenta;
    }

    public void setTipoVenta(String tipoVenta) {
        this.tipoVenta = tipoVenta;
    }

    public List<DetalleVentaRequest> getProductos() {
        return productos;
    }

    public void setProductos(List<DetalleVentaRequest> productos) {
        this.productos = productos;
    }
}
