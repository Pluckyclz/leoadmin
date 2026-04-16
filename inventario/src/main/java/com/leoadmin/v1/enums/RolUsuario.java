package com.leoadmin.v1.enums;

public enum RolUsuario {
    SUPER_ADMIN,
    ADMIN,
    GERENTE,
    EMPLEADO;

    public static RolUsuario fromString(String rol) {
        if (rol == null)
            return null;
        return RolUsuario.valueOf(rol.trim().toUpperCase());
    }
}