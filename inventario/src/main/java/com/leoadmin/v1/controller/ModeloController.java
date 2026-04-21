package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.Marca;
import com.leoadmin.v1.entity.Modelo;
import com.leoadmin.v1.repository.MarcaRepository;
import com.leoadmin.v1.repository.ModeloRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogos/modelos")
public class ModeloController {

    private final ModeloRepository modeloRepository;
    private final MarcaRepository marcaRepository;

    public ModeloController(ModeloRepository modeloRepository, MarcaRepository marcaRepository) {
        this.modeloRepository = modeloRepository;
        this.marcaRepository = marcaRepository;
    }

    @GetMapping
    public List<Modelo> listar() {
        return modeloRepository.findAll();
    }

    @GetMapping("/marca/{marcaId}")
    public List<Modelo> listarPorMarca(@PathVariable Integer marcaId) {
        return modeloRepository.findByMarcaIdAndActivoTrueOrderByNombreAsc(marcaId);
    }

    @PostMapping
    public Modelo crear(@RequestBody Modelo modeloRequest) {
        if (modeloRequest.getMarca() == null || modeloRequest.getMarca().getId() == null) {
            throw new RuntimeException("La marca es obligatoria");
        }

        Marca marca = marcaRepository.findById(modeloRequest.getMarca().getId())
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        Optional<Modelo> existente = modeloRepository.findByNombreIgnoreCaseAndMarca(
                modeloRequest.getNombre(), marca);

        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un modelo con ese nombre para la marca");
        }

        Modelo modelo = new Modelo();
        modelo.setNombre(modeloRequest.getNombre());
        modelo.setMarca(marca);
        modelo.setActivo(modeloRequest.getActivo() != null ? modeloRequest.getActivo() : true);

        return modeloRepository.save(modelo);
    }

    @PutMapping("/{id}")
    public Modelo editar(@PathVariable Integer id, @RequestBody Modelo modeloRequest) {
        Modelo modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));

        if (modeloRequest.getMarca() == null || modeloRequest.getMarca().getId() == null) {
            throw new RuntimeException("La marca es obligatoria");
        }

        Marca marca = marcaRepository.findById(modeloRequest.getMarca().getId())
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        Optional<Modelo> existente = modeloRepository.findByNombreIgnoreCaseAndMarca(
                modeloRequest.getNombre(), marca);

        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new RuntimeException("Ya existe un modelo con ese nombre para la marca");
        }

        modelo.setNombre(modeloRequest.getNombre());
        modelo.setMarca(marca);
        modelo.setActivo(modeloRequest.getActivo() != null ? modeloRequest.getActivo() : modelo.getActivo());

        return modeloRepository.save(modelo);
    }

    @PatchMapping("/{id}/activo")
    public Modelo cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {
        Modelo modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));

        modelo.setActivo(activo);
        return modeloRepository.save(modelo);
    }
}