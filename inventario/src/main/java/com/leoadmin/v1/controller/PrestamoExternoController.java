package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.leoadmin.v1.dto.PrestamoExternoAccionRequest;
import com.leoadmin.v1.dto.PrestamoExternoRequest;
import com.leoadmin.v1.dto.PrestamoExternoResponse;
import com.leoadmin.v1.entity.PrestamoExterno;
import com.leoadmin.v1.entity.PrestamoExternoDetalle;
import com.leoadmin.v1.service.PrestamoExternoService;

@CrossOrigin(origins = "*")
@RestController
public class PrestamoExternoController {

    private final PrestamoExternoService prestamoExternoService;

    public PrestamoExternoController(PrestamoExternoService prestamoExternoService) {
        this.prestamoExternoService = prestamoExternoService;
    }

    @PostMapping("/prestamos-externos")
    public PrestamoExternoResponse crearPrestamo(@RequestBody PrestamoExternoRequest request) {
        return prestamoExternoService.crearPrestamo(request);
    }

    @PostMapping("/prestamos-externos/{id}/devolver")
    public String devolverPieza(
            @PathVariable Integer id,
            @RequestBody PrestamoExternoAccionRequest request) {
        return prestamoExternoService.devolverPieza(id, request);
    }

    @PostMapping("/prestamos-externos/{id}/vender")
    public String venderPieza(
            @PathVariable Integer id,
            @RequestBody PrestamoExternoAccionRequest request) {
        return prestamoExternoService.venderPieza(id, request);
    }

    @PostMapping("/prestamos-externos/{id}/faltante")
    public String marcarFaltante(
            @PathVariable Integer id,
            @RequestBody PrestamoExternoAccionRequest request) {
        return prestamoExternoService.marcarFaltante(id, request);
    }

    @GetMapping("/prestamos-externos/sucursal/{sucursalId}")
    public List<PrestamoExterno> consultarPorSucursal(@PathVariable Integer sucursalId) {
        return prestamoExternoService.consultarPorSucursal(sucursalId);
    }

    @GetMapping("/prestamos-externos/{id}")
    public PrestamoExterno consultarPorId(@PathVariable Integer id) {
        return prestamoExternoService.consultarPorId(id);
    }

    @GetMapping("/prestamos-externos/{id}/detalle")
    public List<PrestamoExternoDetalle> consultarDetalle(@PathVariable Integer id) {
        return prestamoExternoService.consultarDetalle(id);
    }
}