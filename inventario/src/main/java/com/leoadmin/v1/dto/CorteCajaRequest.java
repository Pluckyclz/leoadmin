package com.leoadmin.v1.dto;

import java.math.BigDecimal;

public class CorteCajaRequest {

    private Integer numeroEmpleado;
    private String fechaOperacion;
    private BigDecimal efectivoContado;
    private BigDecimal fondoCambio;
    private String observacion;

    public Integer getNumeroEmpleado() {
        return numeroEmpleado;
    }

    public void setNumeroEmpleado(Integer numeroEmpleado) {
        this.numeroEmpleado = numeroEmpleado;
    }

    public String getFechaOperacion() {
        return fechaOperacion;
    }

    public void setFechaOperacion(String fechaOperacion) {
        this.fechaOperacion = fechaOperacion;
    }

    public BigDecimal getEfectivoContado() {
        return efectivoContado;
    }

    public void setEfectivoContado(BigDecimal efectivoContado) {
        this.efectivoContado = efectivoContado;
    }

    public BigDecimal getFondoCambio() {
        return fondoCambio;
    }

    public void setFondoCambio(BigDecimal fondoCambio) {
        this.fondoCambio = fondoCambio;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}