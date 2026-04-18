package com.leoadmin.v1.dto;

import java.math.BigDecimal;

public class ProductoImportRequest {

    private String claveImagen;
    private String descripcion;
    private String categoria;
    private String marcaCelular;
    private String modeloCelular;
    private String tipoFunda;
    private String genero;
    private BigDecimal precioVenta;
    private BigDecimal precioProveedor;
    private BigDecimal precioEspecial;
    private String proveedor;
    private Integer cantidad;

    // getters y setters

    public String getClaveImagen() {
        return claveImagen;
    }

    public void setClaveImagen(String claveImagen) {
        this.claveImagen = claveImagen;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getMarcaCelular() {
        return marcaCelular;
    }

    public void setMarcaCelular(String marcaCelular) {
        this.marcaCelular = marcaCelular;
    }

    public String getModeloCelular() {
        return modeloCelular;
    }

    public void setModeloCelular(String modeloCelular) {
        this.modeloCelular = modeloCelular;
    }

    public String getTipoFunda() {
        return tipoFunda;
    }

    public void setTipoFunda(String tipoFunda) {
        this.tipoFunda = tipoFunda;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public BigDecimal getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(BigDecimal precioVenta) {
        this.precioVenta = precioVenta;
    }

    public BigDecimal getPrecioProveedor() {
        return precioProveedor;
    }

    public void setPrecioProveedor(BigDecimal precioProveedor) {
        this.precioProveedor = precioProveedor;
    }

    public BigDecimal getPrecioEspecial() {
        return precioEspecial;
    }

    public void setPrecioEspecial(BigDecimal precioEspecial) {
        this.precioEspecial = precioEspecial;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}