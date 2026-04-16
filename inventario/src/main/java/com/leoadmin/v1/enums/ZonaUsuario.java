package com.leoadmin.v1.enums;

public enum ZonaUsuario {
    SANTA_MARTHA,
    CHALCO;

    public static ZonaUsuario fromString(String zona) {
        if (zona == null)
            return null;
        return ZonaUsuario.valueOf(zona.trim().toUpperCase());
    }
}