package com.leoadmin.v1.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RetiroGerencialResponse {

    private Integer retiroId;
    private Integer localId;
    private Integer numeroEmpleado;
    private LocalDateTime fechaHora;
    private BigDecimal monto;
    private String observacion;
    private String mensaje;

    public Integer getRetiroId() {
        return retiroId;
    }

    public void setRetiroId(Integer retiroId) {
        this.retiroId = retiroId;
    }

    public Integer getLocalId() {
        return localId;
    }

    public void setLocalId(Integer localId) {
        this.localId = localId;
    }

    public Integer getNumeroEmpleado() {
        return numeroEmpleado;
    }

    public void setNumeroEmpleado(Integer numeroEmpleado) {
        this.numeroEmpleado = numeroEmpleado;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}