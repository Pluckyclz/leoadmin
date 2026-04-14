package com.leoadmin.v1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leoadmin.v1.dto.AjusteInventarioRequest;
import com.leoadmin.v1.service.AjusteInventarioService;

@CrossOrigin(origins = "*")
@RestController
public class AjusteInventarioController {

    private final AjusteInventarioService ajusteInventarioService;

    public AjusteInventarioController(AjusteInventarioService ajusteInventarioService) {
        this.ajusteInventarioService = ajusteInventarioService;
    }

    @PostMapping("/inventario/ajuste")
    public ResponseEntity<String> ajustarInventario(@RequestBody AjusteInventarioRequest request) {
        String resultado = ajusteInventarioService.ajustarInventario(request);

        if (!"Ajuste registrado correctamente".equals(resultado)) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }
}
