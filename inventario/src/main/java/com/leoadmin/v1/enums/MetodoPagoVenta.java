package com.leoadmin.v1.enums;

public enum MetodoPagoVenta {
    EFECTIVO,
    TRANSFERENCIA;

    public static MetodoPagoVenta fromString(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return MetodoPagoVenta.valueOf(valor.trim().toUpperCase());
    }
}