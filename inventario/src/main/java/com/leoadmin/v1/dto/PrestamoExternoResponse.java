package com.leoadmin.v1.dto;

import java.time.LocalDateTime;

public class PrestamoExternoResponse {

    private Integer prestamoId;
    private String folio;
    private Integer sucursalOrigenId;
    private Integer numeroEmpleado;
    private String nombreLocalExterno;
    private LocalDateTime fechaHora;
    private String estado;
    private Integer totalPiezas;
    private String mensaje;

    public Integer getPrestamoId() {
        return prestamoId;
    }

    public void setPrestamoId(Integer prestamoId) {
        this.prestamoId = prestamoId;
    }

    public String getFolio() {
        return folio;
    }

    public void setFolio(String folio) {
        this.folio = folio;
    }

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

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getTotalPiezas() {
        return totalPiezas;
    }

    public void setTotalPiezas(Integer totalPiezas) {
        this.totalPiezas = totalPiezas;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}