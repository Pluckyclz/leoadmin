package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.repository.LocalRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/catalogos/locales")
public class LocalController {

    private final LocalRepository localRepository;

    public LocalController(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    // 🔹 Listar todos (para administración)
    @GetMapping
    public List<Local> listar() {
        return localRepository.findAll();
    }

    // 🔹 Listar solo activos (para uso operativo)
    @GetMapping("/activos")
    public List<Local> listarActivos() {
        return localRepository.findAll()
                .stream()
                .filter(local -> Boolean.TRUE.equals(local.getActivo()))
                .toList();
    }

    // 🔹 Crear
    @PostMapping
    public Local crear(@RequestBody Local local) {

        if (local.getNombre() == null || local.getNombre().isBlank()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (local.getActivo() == null) {
            local.setActivo(true);
        }

        return localRepository.save(local);
    }

    // 🔹 Editar
    @PutMapping("/{id}")
    public Local editar(@PathVariable Integer id, @RequestBody Local request) {

        Local local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local no encontrado"));

        local.setNombre(request.getNombre());
        local.setZona(request.getZona());
        local.setIp(request.getIp());

        if (request.getActivo() != null) {
            local.setActivo(request.getActivo());
        }

        return localRepository.save(local);
    }

    // 🔹 Activar / Desactivar
    @PatchMapping("/{id}/activo")
    public Local cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {

        Local local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local no encontrado"));

        local.setActivo(activo);

        return localRepository.save(local);
    }
}