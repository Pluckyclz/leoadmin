package com.leoadmin.v1.entity;

import java.time.LocalDateTime;

import com.leoadmin.v1.enums.EstadoPrestamoExternoDetalle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "prestamo_externo_detalle")
public class PrestamoExternoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "prestamo_externo_id")
    private Integer prestamoExternoId;

    @Column(name = "producto_id")
    private Integer productoId;

    @Column(name = "codigo_barras")
    private String codigoBarras;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_detalle")
    private EstadoPrestamoExternoDetalle estadoDetalle;

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    @Column(name = "venta_id")
    private Integer ventaId;

    @Column(name = "observacion")
    private String observacion;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPrestamoExternoId() {
        return prestamoExternoId;
    }

    public void setPrestamoExternoId(Integer prestamoExternoId) {
        this.prestamoExternoId = prestamoExternoId;
    }

    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public EstadoPrestamoExternoDetalle getEstadoDetalle() {
        return estadoDetalle;
    }

    public void setEstadoDetalle(EstadoPrestamoExternoDetalle estadoDetalle) {
        this.estadoDetalle = estadoDetalle;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public Integer getVentaId() {
        return ventaId;
    }

    public void setVentaId(Integer ventaId) {
        this.ventaId = ventaId;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}