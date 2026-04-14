package com.leoadmin.v1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.dto.EntradaInventarioRequest;
import com.leoadmin.v1.service.EntradaInventarioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class EntradaInventarioController {

    private final EntradaInventarioService entradaInventarioService;

    public EntradaInventarioController(EntradaInventarioService entradaInventarioService) {
        this.entradaInventarioService = entradaInventarioService;
    }

    @PostMapping("/inventario/entrada")
    public ResponseEntity<String> entradaInventario(@RequestBody EntradaInventarioRequest request) {
        String resultado = entradaInventarioService.registrarEntrada(request);

        if (!"Entrada registrada correctamente".equals(resultado)) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }
}
