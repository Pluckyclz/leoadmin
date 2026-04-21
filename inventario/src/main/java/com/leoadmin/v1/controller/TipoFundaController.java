package com.leoadmin.v1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.entity.TipoFunda;
import com.leoadmin.v1.repository.TipoFundaRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogos/tipos-funda")
public class TipoFundaController {

    private final TipoFundaRepository tipoFundaRepository;

    public TipoFundaController(TipoFundaRepository tipoFundaRepository) {
        this.tipoFundaRepository = tipoFundaRepository;
    }

    @GetMapping
    public List<TipoFunda> listar() {
        return tipoFundaRepository.findAll();
    }

    @PostMapping
    public TipoFunda crear(@RequestBody TipoFunda tipoFunda) {
        Optional<TipoFunda> existente = tipoFundaRepository.findByNombreIgnoreCase(tipoFunda.getNombre());

        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un tipo de funda con ese nombre");
        }

        if (tipoFunda.getActivo() == null) {
            tipoFunda.setActivo(true);
        }

        return tipoFundaRepository.save(tipoFunda);
    }

    @PutMapping("/{id}")
    public TipoFunda editar(@PathVariable Integer id, @RequestBody TipoFunda tipoFundaRequest) {
        TipoFunda tipoFunda = tipoFundaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de funda no encontrado"));

        Optional<TipoFunda> existente = tipoFundaRepository.findByNombreIgnoreCase(tipoFundaRequest.getNombre());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new RuntimeException("Ya existe un tipo de funda con ese nombre");
        }

        tipoFunda.setNombre(tipoFundaRequest.getNombre());
        tipoFunda
                .setActivo(tipoFundaRequest.getActivo() != null ? tipoFundaRequest.getActivo() : tipoFunda.getActivo());

        return tipoFundaRepository.save(tipoFunda);
    }

    @PatchMapping("/{id}/activo")
    public TipoFunda cambiarActivo(@PathVariable Integer id, @RequestParam Boolean activo) {
        TipoFunda tipoFunda = tipoFundaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de funda no encontrado"));

        tipoFunda.setActivo(activo);
        return tipoFundaRepository.save(tipoFunda);
    }
}