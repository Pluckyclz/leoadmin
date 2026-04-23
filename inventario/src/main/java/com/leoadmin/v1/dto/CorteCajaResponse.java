package com.leoadmin.v1.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CorteCajaResponse {

    private Integer corteId;
    private Integer localId;
    private Integer numeroEmpleado;
    private LocalDateTime fechaHora;
    private String fechaOperacion;

    private BigDecimal ventasEfectivo;
    private BigDecimal ventasTransferencia;
    private BigDecimal devolucionesEfectivo;
    private BigDecimal devolucionesTransferencia;
    private BigDecimal retirosGerenciales;
    private BigDecimal efectivoEsperado;
    private BigDecimal efectivoContado;
    private BigDecimal fondoCambio;
    private BigDecimal diferencia;

    private String observacion;
    private String mensaje;

    public Integer getCorteId() {
        return corteId;
    }

    public void setCorteId(Integer corteId) {
        this.corteId = corteId;
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

    public String getFechaOperacion() {
        return fechaOperacion;
    }

    public void setFechaOperacion(String fechaOperacion) {
        this.fechaOperacion = fechaOperacion;
    }

    public BigDecimal getVentasEfectivo() {
        return ventasEfectivo;
    }

    public void setVentasEfectivo(BigDecimal ventasEfectivo) {
        this.ventasEfectivo = ventasEfectivo;
    }

    public BigDecimal getVentasTransferencia() {
        return ventasTransferencia;
    }

    public void setVentasTransferencia(BigDecimal ventasTransferencia) {
        this.ventasTransferencia = ventasTransferencia;
    }

    public BigDecimal getDevolucionesEfectivo() {
        return devolucionesEfectivo;
    }

    public void setDevolucionesEfectivo(BigDecimal devolucionesEfectivo) {
        this.devolucionesEfectivo = devolucionesEfectivo;
    }

    public BigDecimal getDevolucionesTransferencia() {
        return devolucionesTransferencia;
    }

    public void setDevolucionesTransferencia(BigDecimal devolucionesTransferencia) {
        this.devolucionesTransferencia = devolucionesTransferencia;
    }

    public BigDecimal getRetirosGerenciales() {
        return retirosGerenciales;
    }

    public void setRetirosGerenciales(BigDecimal retirosGerenciales) {
        this.retirosGerenciales = retirosGerenciales;
    }

    public BigDecimal getEfectivoEsperado() {
        return efectivoEsperado;
    }

    public void setEfectivoEsperado(BigDecimal efectivoEsperado) {
        this.efectivoEsperado = efectivoEsperado;
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

    public BigDecimal getDiferencia() {
        return diferencia;
    }

    public void setDiferencia(BigDecimal diferencia) {
        this.diferencia = diferencia;
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