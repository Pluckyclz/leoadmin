package com.leoadmin.v1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.dto.VentaRequest;
import com.leoadmin.v1.dto.VentaResponse;
import com.leoadmin.v1.service.VentaService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<VentaResponse> registrarVenta(
            @RequestBody VentaRequest request,
            HttpServletRequest httpRequest) {

        if (request.getNumeroEmpleado() == null) {
            return respuestaError("El número de empleado es obligatorio");
        }

        if (request.getProductos() == null || request.getProductos().isEmpty()) {
            return respuestaError("La venta debe incluir al menos un producto");
        }

        VentaResponse resultado = ventaService.procesarVenta(request, httpRequest);

        if (!"Venta registrada correctamente".equals(resultado.getMensaje())) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    private ResponseEntity<VentaResponse> respuestaError(String mensaje) {
        VentaResponse response = new VentaResponse();
        response.setMensaje(mensaje);
        return ResponseEntity.badRequest().body(response);
    }
}