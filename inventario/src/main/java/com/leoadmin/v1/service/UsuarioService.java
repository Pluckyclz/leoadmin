package com.leoadmin.v1.service;

import org.springframework.stereotype.Service;

import com.leoadmin.v1.dto.UsuarioRequest;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.enums.RolUsuario;
import com.leoadmin.v1.enums.ZonaUsuario;
import com.leoadmin.v1.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public String crearUsuario(UsuarioRequest request) {

        String validacion = validarRequest(request, null);
        if (validacion != null) {
            return validacion;
        }

        RolUsuario rol = RolUsuario.fromString(request.getRol());
        ZonaUsuario zona = ZonaUsuario.fromString(request.getZona());

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setNumeroEmpleado(request.getNumeroEmpleado());
        usuario.setPassword(request.getPassword());
        usuario.setRol(rol);
        usuario.setZona(zona);
        usuario.setRequiereLogin(request.getRequiereLogin() != null ? request.getRequiereLogin() : false);
        usuario.setTelefono(request.getTelefono());
        usuario.setEmail(request.getEmail());
        usuario.setActivo(request.getActivo() != null ? request.getActivo() : true);

        usuarioRepository.save(usuario);

        return "Usuario creado correctamente";
    }

    public String actualizarUsuario(Integer id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return "Usuario no encontrado";
        }

        String validacion = validarRequest(request, id);
        if (validacion != null) {
            return validacion;
        }

        RolUsuario rol = RolUsuario.fromString(request.getRol());
        ZonaUsuario zona = ZonaUsuario.fromString(request.getZona());

        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setNumeroEmpleado(request.getNumeroEmpleado());
        usuario.setRol(rol);
        usuario.setZona(zona);
        usuario.setRequiereLogin(request.getRequiereLogin() != null ? request.getRequiereLogin() : false);
        usuario.setTelefono(request.getTelefono());
        usuario.setEmail(request.getEmail());
        usuario.setActivo(request.getActivo() != null ? request.getActivo() : usuario.getActivo());

        if (Boolean.TRUE.equals(request.getRequiereLogin())
                && request.getPassword() != null
                && !request.getPassword().isBlank()) {
            usuario.setPassword(request.getPassword());
        }

        if (Boolean.FALSE.equals(request.getRequiereLogin())) {
            usuario.setPassword(null);
        }

        usuarioRepository.save(usuario);

        return "Usuario actualizado correctamente";
    }

    public String cambiarEstatus(Integer id, Boolean activo) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return "Usuario no encontrado";
        }

        if (activo == null) {
            return "El estatus es obligatorio";
        }

        usuario.setActivo(activo);
        usuarioRepository.save(usuario);

        return activo ? "Usuario activado correctamente" : "Usuario desactivado correctamente";
    }

    private String validarRequest(UsuarioRequest request, Integer usuarioIdActual) {

        if (request.getNombreCompleto() == null || request.getNombreCompleto().isBlank()) {
            return "El nombre completo es obligatorio";
        }

        if (request.getNumeroEmpleado() == null) {
            return "El número de empleado es obligatorio";
        }

        if (request.getRol() == null || request.getRol().isBlank()) {
            return "El rol es obligatorio";
        }

        if (request.getZona() == null || request.getZona().isBlank()) {
            return "La zona es obligatoria";
        }

        if (Boolean.TRUE.equals(request.getRequiereLogin())) {
            if (usuarioIdActual == null) {
                if (request.getPassword() == null || request.getPassword().isBlank()) {
                    return "La contraseña es obligatoria para usuarios con acceso";
                }
            }
        }

        try {
            RolUsuario.fromString(request.getRol());
        } catch (IllegalArgumentException e) {
            return "Rol no válido. Usa: SUPER_ADMIN, ADMIN, GERENTE, EMPLEADO";
        }

        try {
            ZonaUsuario.fromString(request.getZona());
        } catch (IllegalArgumentException e) {
            return "Zona no válida. Usa: SANTA_MARTHA o CHALCO";
        }

        Usuario existente = usuarioRepository.findByNumeroEmpleado(request.getNumeroEmpleado()).orElse(null);

        if (existente != null) {
            if (usuarioIdActual == null || !existente.getId().equals(usuarioIdActual)) {
                return "Ya existe un usuario con ese número de empleado";
            }
        }

        return null;
    }
}