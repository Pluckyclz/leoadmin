package com.leoadmin.v1.service;

import org.springframework.stereotype.Service;

import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.repository.LocalRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class LocalService {

    private final LocalRepository localRepository;

    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    public Local obtenerLocalDesdeRequest(HttpServletRequest request) {
        String ip = request.getRemoteAddr();

        Local local = localRepository.findByIp(ip).orElse(null);

        if (local != null) {
            return local;
        }

        // Fallback solo para desarrollo local
        if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            return localRepository.findFirstByActivoTrueOrderByIdAsc().orElse(null);
        }

        return null;
    }
}