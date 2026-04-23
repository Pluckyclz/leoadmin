package com.leoadmin.v1.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.RetiroGerencialRequest;
import com.leoadmin.v1.dto.RetiroGerencialResponse;
import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.entity.RetiroGerencial;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.repository.RetiroGerencialRepository;
import com.leoadmin.v1.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class RetiroGerencialService {

    private final RetiroGerencialRepository retiroGerencialRepository;
    private final UsuarioRepository usuarioRepository;
    private final LocalService localService;

    public RetiroGerencialService(
            RetiroGerencialRepository retiroGerencialRepository,
            UsuarioRepository usuarioRepository,
            LocalService localService) {
        this.retiroGerencialRepository = retiroGerencialRepository;
        this.usuarioRepository = usuarioRepository;
        this.localService = localService;
    }

    @Transactional
    public RetiroGerencialResponse registrarRetiro(
            RetiroGerencialRequest request,
            HttpServletRequest httpRequest) {

        RetiroGerencialResponse response = new RetiroGerencialResponse();

        Local local = localService.obtenerLocalDesdeRequest(httpRequest);

        if (local == null) {
            response.setMensaje("No se pudo identificar el local desde la IP");
            return response;
        }

        if (request.getNumeroEmpleado() == null) {
            response.setMensaje("El número de empleado es obligatorio");
            return response;
        }

        if (request.getMonto() == null || request.getMonto().signum() <= 0) {
            response.setMensaje("El monto debe ser mayor a 0");
            return response;
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

        RetiroGerencial retiro = new RetiroGerencial();
        retiro.setLocalId(local.getId());
        retiro.setNumeroEmpleado(request.getNumeroEmpleado());
        retiro.setFechaHora(LocalDateTime.now());
        retiro.setMonto(request.getMonto());
        retiro.setObservacion(request.getObservacion());

        RetiroGerencial retiroGuardado = retiroGerencialRepository.save(retiro);

        response.setRetiroId(retiroGuardado.getId());
        response.setLocalId(retiroGuardado.getLocalId());
        response.setNumeroEmpleado(retiroGuardado.getNumeroEmpleado());
        response.setFechaHora(retiroGuardado.getFechaHora());
        response.setMonto(retiroGuardado.getMonto());
        response.setObservacion(retiroGuardado.getObservacion());
        response.setMensaje("Retiro gerencial registrado correctamente");

        return response;
    }
}