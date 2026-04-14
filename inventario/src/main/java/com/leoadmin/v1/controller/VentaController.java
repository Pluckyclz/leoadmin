package com.leoadmin.v1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leoadmin.v1.dto.VentaRequest;
import com.leoadmin.v1.dto.VentaResponse;
import com.leoadmin.v1.service.VentaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping("/ventas")
    public ResponseEntity<VentaResponse> registrarVenta(@RequestBody VentaRequest request) {

        if (request.getSucursalId() == null) {
            return respuestaError("La sucursal es obligatoria");
        }

        if (request.getNumeroEmpleado() == null || request.getNumeroEmpleado().isBlank()) {
            return respuestaError("El número de empleado es obligatorio");
        }

        if (request.getProductos() == null || request.getProductos().isEmpty()) {
            return respuestaError("La venta debe incluir al menos un producto");
        }

        VentaResponse resultado = ventaService.procesarVenta(request);

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
