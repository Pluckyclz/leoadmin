package com.leoadmin.v1.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.dto.RetiroGerencialRequest;
import com.leoadmin.v1.dto.RetiroGerencialResponse;
import com.leoadmin.v1.entity.RetiroGerencial;
import com.leoadmin.v1.repository.RetiroGerencialRepository;
import com.leoadmin.v1.service.RetiroGerencialService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@CrossOrigin(origins = "*")
@RestController
public class RetiroGerencialController {

    private final RetiroGerencialService retiroGerencialService;
    private final RetiroGerencialRepository retiroGerencialRepository;

    public RetiroGerencialController(
            RetiroGerencialService retiroGerencialService,
            RetiroGerencialRepository retiroGerencialRepository) {
        this.retiroGerencialService = retiroGerencialService;
        this.retiroGerencialRepository = retiroGerencialRepository;
    }

    @PostMapping("/retiros-gerenciales")
    public RetiroGerencialResponse registrarRetiro(
            @RequestBody RetiroGerencialRequest request,
            HttpServletRequest httpRequest) {
        return retiroGerencialService.registrarRetiro(request, httpRequest);
    }

    @GetMapping("/retiros-gerenciales/local/{localId}")
    public List<RetiroGerencial> consultarPorLocal(@PathVariable Integer localId) {
        return retiroGerencialRepository.findByLocalIdOrderByFechaHoraDesc(localId);
    }

    @GetMapping("/retiros-gerenciales/local/{localId}/fecha")
    public List<RetiroGerencial> consultarPorLocalYFecha(
            @PathVariable Integer localId,
            @RequestParam String fecha) {

        LocalDate dia = LocalDate.parse(fecha);
        LocalDateTime inicio = dia.atStartOfDay();
        LocalDateTime fin = dia.plusDays(1).atStartOfDay();

        return retiroGerencialRepository.findByLocalIdAndFechaHoraBetweenOrderByFechaHoraDesc(
                localId,
                inicio,
                fin);
    }
}