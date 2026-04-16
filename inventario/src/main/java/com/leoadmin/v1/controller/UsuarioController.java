package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.dto.UsuarioRequest;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.repository.UsuarioRepository;
import com.leoadmin.v1.service.UsuarioService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<String> crearUsuario(@RequestBody UsuarioRequest request) {
        String resultado = usuarioService.crearUsuario(request);

        if ("Usuario creado correctamente".equalsIgnoreCase(resultado)) {
            return ResponseEntity.ok(resultado);
        }

        return ResponseEntity.badRequest().body(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarUsuario(
            @PathVariable Integer id,
            @RequestBody UsuarioRequest request) {

        String resultado = usuarioService.actualizarUsuario(id, request);

        if ("Usuario actualizado correctamente".equalsIgnoreCase(resultado)) {
            return ResponseEntity.ok(resultado);
        }

        return ResponseEntity.badRequest().body(resultado);
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> cambiarEstatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {

        Boolean activo = body.get("activo");
        String resultado = usuarioService.cambiarEstatus(id, activo);

        if (resultado.toLowerCase().contains("correctamente")) {
            return ResponseEntity.ok(resultado);
        }

        return ResponseEntity.badRequest().body(resultado);
    }
}