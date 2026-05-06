package com.leoadmin.v1.dto;

public class LoginResponse {

    private Integer id;
    private Integer numeroEmpleado;
    private String nombreCompleto;
    private String rol;
    private String zona;
    private Boolean requiereLogin;
    private String mensaje;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNumeroEmpleado() {
        return numeroEmpleado;
    }

    public void setNumeroEmpleado(Integer numeroEmpleado) {
        this.numeroEmpleado = numeroEmpleado;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public Boolean getRequiereLogin() {
        return requiereLogin;
    }

    public void setRequiereLogin(Boolean requiereLogin) {
        this.requiereLogin = requiereLogin;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}