package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.Genero;
import com.leoadmin.v1.repository.GeneroRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogos/generos")
public class GeneroController {

    private final GeneroRepository generoRepository;

    public GeneroController(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    @GetMapping
    public List<Genero> listar() {
        return generoRepository.findAll();
    }

    @PostMapping
    public Genero crear(@RequestBody Genero genero) {
        Optional<Genero> existente = generoRepository.findByNombreIgnoreCase(genero.getNombre());

        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un género con ese nombre");
        }

        if (genero.getActivo() == null) {
            genero.setActivo(true);
        }

        return generoRepository.save(genero);
    }

    @PutMapping("/{id}")
    public Genero editar(@PathVariable Integer id, @RequestBody Genero generoRequest) {
        Genero genero = generoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));

        Optional<Genero> existente = generoRepository.findByNombreIgnoreCase(generoRequest.getNombre());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new RuntimeException("Ya existe un género con ese nombre");
        }

        genero.setNombre(generoRequest.getNombre());
        genero.setActivo(generoRequest.getActivo() != null ? generoRequest.getActivo() : genero.getActivo());

        return generoRepository.save(genero);
    }

    @PatchMapping("/{id}/activo")
    public Genero cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {
        Genero genero = generoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));

        genero.setActivo(activo);
        return generoRepository.save(genero);
    }
}