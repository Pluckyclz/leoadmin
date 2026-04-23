package com.leoadmin.v1.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.CorteCajaRequest;
import com.leoadmin.v1.dto.CorteCajaResponse;
import com.leoadmin.v1.dto.ResumenCajaResponse;
import com.leoadmin.v1.entity.CorteCaja;
import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.repository.CorteCajaRepository;
import com.leoadmin.v1.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class CorteCajaService {

    private final CorteCajaRepository corteCajaRepository;
    private final ResumenCajaService resumenCajaService;
    private final UsuarioRepository usuarioRepository;
    private final LocalService localService;

    public CorteCajaService(
            CorteCajaRepository corteCajaRepository,
            ResumenCajaService resumenCajaService,
            UsuarioRepository usuarioRepository,
            LocalService localService) {
        this.corteCajaRepository = corteCajaRepository;
        this.resumenCajaService = resumenCajaService;
        this.usuarioRepository = usuarioRepository;
        this.localService = localService;
    }

    @Transactional
    public CorteCajaResponse registrarCorte(
            CorteCajaRequest request,
            HttpServletRequest httpRequest) {

        CorteCajaResponse response = new CorteCajaResponse();

        Local local = localService.obtenerLocalDesdeRequest(httpRequest);
        if (local == null) {
            response.setMensaje("No se pudo identificar el local desde la IP");
            return response;
        }

        if (request.getNumeroEmpleado() == null) {
            response.setMensaje("El número de empleado es obligatorio");
            return response;
        }

        if (request.getFechaOperacion() == null || request.getFechaOperacion().isBlank()) {
            response.setMensaje("La fecha de operación es obligatoria");
            return response;
        }

        if (request.getEfectivoContado() == null) {
            response.setMensaje("El efectivo contado es obligatorio");
            return response;
        }

        if (request.getFondoCambio() == null) {
            request.setFondoCambio(BigDecimal.ZERO);
        }

        Usuario usuario = usuarioRepository
                .findByNumeroEmpleado(request.getNumeroEmpleado())
                .orElse(null);

        if (usuario == null) {
            response.setMensaje("Empleado no válido");
            return response;
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            response.setMensaje("Empleado inactivo");
            return response;
        }

        ResumenCajaResponse resumen = resumenCajaService.obtenerResumen(
                local.getId(),
                request.getFechaOperacion());

        BigDecimal diferencia = request.getEfectivoContado()
                .subtract(resumen.getEfectivoEsperado());

        CorteCaja corte = new CorteCaja();
        corte.setLocalId(local.getId());
        corte.setNumeroEmpleado(request.getNumeroEmpleado());
        corte.setFechaHora(LocalDateTime.now());
        corte.setFechaOperacion(request.getFechaOperacion());

        corte.setVentasEfectivo(resumen.getVentasEfectivo());
        corte.setVentasTransferencia(resumen.getVentasTransferencia());
        corte.setDevolucionesEfectivo(resumen.getDevolucionesEfectivo());
        corte.setDevolucionesTransferencia(resumen.getDevolucionesTransferencia());
        corte.setRetirosGerenciales(resumen.getRetirosGerenciales());
        corte.setEfectivoEsperado(resumen.getEfectivoEsperado());

        corte.setEfectivoContado(request.getEfectivoContado());
        corte.setFondoCambio(request.getFondoCambio());
        corte.setDiferencia(diferencia);
        corte.setObservacion(request.getObservacion());

        CorteCaja guardado = corteCajaRepository.save(corte);

        response.setCorteId(guardado.getId());
        response.setLocalId(guardado.getLocalId());
        response.setNumeroEmpleado(guardado.getNumeroEmpleado());
        response.setFechaHora(guardado.getFechaHora());
        response.setFechaOperacion(guardado.getFechaOperacion());
        response.setVentasEfectivo(guardado.getVentasEfectivo());
        response.setVentasTransferencia(guardado.getVentasTransferencia());
        response.setDevolucionesEfectivo(guardado.getDevolucionesEfectivo());
        response.setDevolucionesTransferencia(guardado.getDevolucionesTransferencia());
        response.setRetirosGerenciales(guardado.getRetirosGerenciales());
        response.setEfectivoEsperado(guardado.getEfectivoEsperado());
        response.setEfectivoContado(guardado.getEfectivoContado());
        response.setFondoCambio(guardado.getFondoCambio());
        response.setDiferencia(guardado.getDiferencia());
        response.setObservacion(guardado.getObservacion());
        response.setMensaje("Corte registrado correctamente");

        return response;
    }
}