package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.dto.MovimientoInventarioResponse;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.service.MovimientoInventarioService;

@CrossOrigin(origins = "*")
@RestController
public class MovimientoInventarioController {

    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final MovimientoInventarioService movimientoInventarioService;

    public MovimientoInventarioController(
            MovimientoInventarioRepository movimientoInventarioRepository,
            MovimientoInventarioService movimientoInventarioService) {
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.movimientoInventarioService = movimientoInventarioService;
    }

    @GetMapping("/movimientos/sucursal/{sucursalId}")
    public List<MovimientoInventario> consultarMovimientosPorSucursal(@PathVariable Integer sucursalId) {
        return movimientoInventarioRepository.findBySucursalIdOrderByFechaHoraDesc(sucursalId);
    }

    @GetMapping("/movimientos-inventario")
    public List<MovimientoInventarioResponse> consultarMovimientos(
            @RequestParam(required = false) Integer sucursalId,
            @RequestParam(required = false) String tipoMovimiento) {

        return movimientoInventarioService.consultarMovimientos(sucursalId, tipoMovimiento);
    }
}