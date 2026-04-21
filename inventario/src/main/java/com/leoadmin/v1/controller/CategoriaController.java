package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.Categoria;
import com.leoadmin.v1.repository.CategoriaRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogos/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        Optional<Categoria> existente = categoriaRepository.findByNombreIgnoreCase(categoria.getNombre());

        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        if (categoria.getActivo() == null) {
            categoria.setActivo(true);
        }

        return categoriaRepository.save(categoria);
    }

    @PutMapping("/{id}")
    public Categoria editar(@PathVariable Integer id, @RequestBody Categoria categoriaRequest) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Optional<Categoria> existente = categoriaRepository.findByNombreIgnoreCase(categoriaRequest.getNombre());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        categoria.setNombre(categoriaRequest.getNombre());
        categoria
                .setActivo(categoriaRequest.getActivo() != null ? categoriaRequest.getActivo() : categoria.getActivo());

        return categoriaRepository.save(categoria);
    }

    @PatchMapping("/{id}/activo")
    public Categoria cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        categoria.setActivo(activo);
        return categoriaRepository.save(categoria);
    }
}