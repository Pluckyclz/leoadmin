package com.leoadmin.v1.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.dto.ResumenCajaResponse;
import com.leoadmin.v1.service.ResumenCajaService;

@CrossOrigin(origins = "*")
@RestController
public class ResumenCajaController {

    private final ResumenCajaService resumenCajaService;

    public ResumenCajaController(ResumenCajaService resumenCajaService) {
        this.resumenCajaService = resumenCajaService;
    }

    @GetMapping("/resumen-caja/local/{localId}")
    public ResumenCajaResponse obtenerResumen(
            @PathVariable Integer localId,
            @RequestParam String fecha) {
        return resumenCajaService.obtenerResumen(localId, fecha);
    }
}