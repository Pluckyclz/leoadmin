package com.leoadmin.v1.dto;

import java.util.List;

public class PrestamoExternoRequest {

    private Integer sucursalOrigenId;
    private Integer numeroEmpleado;
    private String nombreLocalExterno;
    private String observacion;
    private List<String> codigosBarras;

    public Integer getSucursalOrigenId() {
        return sucursalOrigenId;
    }

    public void setSucursalOrigenId(Integer sucursalOrigenId) {
        this.sucursalOrigenId = sucursalOrigenId;
    }

    public Integer getNumeroEmpleado() {
        return numeroEmpleado;
    }

    public void setNumeroEmpleado(Integer numeroEmpleado) {
        this.numeroEmpleado = numeroEmpleado;
    }

    public String getNombreLocalExterno() {
        return nombreLocalExterno;
    }

    public void setNombreLocalExterno(String nombreLocalExterno) {
        this.nombreLocalExterno = nombreLocalExterno;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public List<String> getCodigosBarras() {
        return codigosBarras;
    }

    public void setCodigosBarras(List<String> codigosBarras) {
        this.codigosBarras = codigosBarras;
    }
}