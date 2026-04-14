package com.leoadmin.v1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leoadmin.v1.dto.DevolucionRequest;
import com.leoadmin.v1.service.DevolucionService;

@RestController
public class DevolucionController {

    private final DevolucionService devolucionService;

    public DevolucionController(DevolucionService devolucionService) {
        this.devolucionService = devolucionService;
    }

    @PostMapping("/inventario/devolucion")
    public ResponseEntity<String> registrarDevolucion(@RequestBody DevolucionRequest request) {
        String resultado = devolucionService.registrarDevolucion(request);

        if (!"Devolución registrada correctamente".equals(resultado)) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }
}