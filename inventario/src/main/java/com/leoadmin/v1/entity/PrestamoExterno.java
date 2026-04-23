package com.leoadmin.v1.entity;

import java.time.LocalDateTime;

import com.leoadmin.v1.enums.EstadoPrestamoExterno;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "prestamo_externo")
public class PrestamoExterno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "folio")
    private String folio;

    @Column(name = "sucursal_origen_id")
    private Integer sucursalOrigenId;

    @Column(name = "numero_empleado")
    private Integer numeroEmpleado;

    @Column(name = "nombre_local_externo")
    private String nombreLocalExterno;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPrestamoExterno estado;

    @Column(name = "observacion")
    private String observacion;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public EstadoPrestamoExterno getEstado() {
        return estado;
    }

    public void setEstado(EstadoPrestamoExterno estado) {
        this.estado = estado;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}