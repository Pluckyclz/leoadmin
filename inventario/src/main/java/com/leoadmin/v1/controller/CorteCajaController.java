package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import com.leoadmin.v1.dto.CorteCajaRequest;
import com.leoadmin.v1.dto.CorteCajaResponse;
import com.leoadmin.v1.entity.CorteCaja;
import com.leoadmin.v1.repository.CorteCajaRepository;
import com.leoadmin.v1.service.CorteCajaService;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
public class CorteCajaController {

    private final CorteCajaService corteCajaService;
    private final CorteCajaRepository corteCajaRepository;

    public CorteCajaController(
            CorteCajaService corteCajaService,
            CorteCajaRepository corteCajaRepository) {
        this.corteCajaService = corteCajaService;
        this.corteCajaRepository = corteCajaRepository;
    }

    @PostMapping("/cortes-caja")
    public CorteCajaResponse registrarCorte(
            @RequestBody CorteCajaRequest request,
            HttpServletRequest httpRequest) {
        return corteCajaService.registrarCorte(request, httpRequest);
    }

    @GetMapping("/cortes-caja/local/{localId}")
    public List<CorteCaja> consultarPorLocal(@PathVariable Integer localId) {
        return corteCajaRepository.findByLocalIdOrderByFechaHoraDesc(localId);
    }

    @GetMapping("/cortes-caja/local/{localId}/fecha")
    public List<CorteCaja> consultarPorLocalYFecha(
            @PathVariable Integer localId,
            @RequestParam String fecha) {
        return corteCajaRepository.findByLocalIdAndFechaOperacionOrderByFechaHoraDesc(localId, fecha);
    }
}