package com.leoadmin.v1.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "corte_caja")
public class CorteCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "local_id")
    private Integer localId;

    @Column(name = "numero_empleado")
    private Integer numeroEmpleado;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @Column(name = "fecha_operacion")
    private String fechaOperacion;

    @Column(name = "ventas_efectivo")
    private BigDecimal ventasEfectivo;

    @Column(name = "ventas_transferencia")
    private BigDecimal ventasTransferencia;

    @Column(name = "devoluciones_efectivo")
    private BigDecimal devolucionesEfectivo;

    @Column(name = "devoluciones_transferencia")
    private BigDecimal devolucionesTransferencia;

    @Column(name = "retiros_gerenciales")
    private BigDecimal retirosGerenciales;

    @Column(name = "efectivo_esperado")
    private BigDecimal efectivoEsperado;

    @Column(name = "efectivo_contado")
    private BigDecimal efectivoContado;

    @Column(name = "fondo_cambio")
    private BigDecimal fondoCambio;

    @Column(name = "diferencia")
    private BigDecimal diferencia;

    @Column(name = "observacion")
    private String observacion;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
}