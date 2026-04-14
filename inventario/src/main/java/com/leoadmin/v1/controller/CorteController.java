package com.leoadmin.v1.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.dto.CorteResponse;
import com.leoadmin.v1.entity.Venta;
import com.leoadmin.v1.repository.VentaRepository;

@CrossOrigin(origins = "*")
@RestController
public class CorteController {

    private final VentaRepository ventaRepository;

    public CorteController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @GetMapping("/corte/sucursal/{sucursalId}")
    public CorteResponse corteDelDia(@PathVariable Integer sucursalId) {

        LocalDate hoy = LocalDate.now();
        LocalDateTime inicio = hoy.atStartOfDay();
        LocalDateTime fin = hoy.atTime(LocalTime.MAX);

        List<Venta> ventas = ventaRepository.findBySucursalIdAndFechaHoraBetween(sucursalId, inicio, fin);

        BigDecimal total = BigDecimal.ZERO;

        for (Venta venta : ventas) {
            total = total.add(venta.getTotal());
        }

        CorteResponse response = new CorteResponse();
        response.setSucursalId(sucursalId);
        response.setFecha(hoy);
        response.setTotalVentas(ventas.size());
        response.setTotalImporte(total);

        return response;
    }
}
