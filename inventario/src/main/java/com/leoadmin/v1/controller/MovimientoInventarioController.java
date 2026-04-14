package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;

@RestController
public class MovimientoInventarioController {

    private final MovimientoInventarioRepository movimientoInventarioRepository;

    public MovimientoInventarioController(MovimientoInventarioRepository movimientoInventarioRepository) {
        this.movimientoInventarioRepository = movimientoInventarioRepository;
    }

    @GetMapping("/movimientos/sucursal/{sucursalId}")
    public List<MovimientoInventario> consultarMovimientos(@PathVariable Integer sucursalId) {
        return movimientoInventarioRepository.findBySucursalIdOrderByFechaHoraDesc(sucursalId);
    }
}
