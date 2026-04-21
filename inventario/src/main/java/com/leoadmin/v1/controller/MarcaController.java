package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.Marca;
import com.leoadmin.v1.repository.MarcaRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogos/marcas")
public class MarcaController {

    private final MarcaRepository marcaRepository;

    public MarcaController(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    @GetMapping
    public List<Marca> listar() {
        return marcaRepository.findAll();
    }

    @PostMapping
    public Marca crear(@RequestBody Marca marca) {
        Optional<Marca> existente = marcaRepository.findByNombreIgnoreCase(marca.getNombre());

        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe una marca con ese nombre");
        }

        if (marca.getActivo() == null) {
            marca.setActivo(true);
        }

        return marcaRepository.save(marca);
    }

    @PutMapping("/{id}")
    public Marca editar(@PathVariable Integer id, @RequestBody Marca marcaRequest) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        Optional<Marca> existente = marcaRepository.findByNombreIgnoreCase(marcaRequest.getNombre());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new RuntimeException("Ya existe una marca con ese nombre");
        }

        marca.setNombre(marcaRequest.getNombre());
        marca.setActivo(marcaRequest.getActivo() != null ? marcaRequest.getActivo() : marca.getActivo());

        return marcaRepository.save(marca);
    }

    @PatchMapping("/{id}/activo")
    public Marca cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        marca.setActivo(activo);
        return marcaRepository.save(marca);
    }
}
