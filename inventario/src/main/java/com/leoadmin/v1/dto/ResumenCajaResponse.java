package com.leoadmin.v1.dto;

import java.math.BigDecimal;

public class ResumenCajaResponse {

    private Integer localId;
    private String fecha;

    private BigDecimal ventasEfectivo;
    private BigDecimal ventasTransferencia;

    private BigDecimal devolucionesEfectivo;
    private BigDecimal devolucionesTransferencia;

    private BigDecimal retirosGerenciales;

    private BigDecimal efectivoEsperado;

    public Integer getLocalId() {
        return localId;
    }

    public void setLocalId(Integer localId) {
        this.localId = localId;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
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
}