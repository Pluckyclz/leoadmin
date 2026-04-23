package com.leoadmin.v1.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.leoadmin.v1.dto.ResumenCajaResponse;
import com.leoadmin.v1.entity.RetiroGerencial;
import com.leoadmin.v1.entity.Venta;
import com.leoadmin.v1.enums.MetodoPagoVenta;
import com.leoadmin.v1.repository.RetiroGerencialRepository;
import com.leoadmin.v1.repository.VentaRepository;

@Service
public class ResumenCajaService {

    private final VentaRepository ventaRepository;
    private final RetiroGerencialRepository retiroGerencialRepository;

    public ResumenCajaService(
            VentaRepository ventaRepository,
            RetiroGerencialRepository retiroGerencialRepository) {
        this.ventaRepository = ventaRepository;
        this.retiroGerencialRepository = retiroGerencialRepository;
    }

    public ResumenCajaResponse obtenerResumen(Integer localId, String fecha) {

        LocalDate dia = LocalDate.parse(fecha);
        LocalDateTime inicio = dia.atStartOfDay();
        LocalDateTime fin = dia.plusDays(1).atStartOfDay();

        List<Venta> ventas = ventaRepository.findByLocalIdAndFechaHoraBetween(localId, inicio, fin);
        List<RetiroGerencial> retiros = retiroGerencialRepository
                .findByLocalIdAndFechaHoraBetweenOrderByFechaHoraDesc(localId, inicio, fin);

        BigDecimal ventasEfectivo = BigDecimal.ZERO;
        BigDecimal ventasTransferencia = BigDecimal.ZERO;
        BigDecimal devolucionesEfectivo = BigDecimal.ZERO;
        BigDecimal devolucionesTransferencia = BigDecimal.ZERO;
        BigDecimal retirosGerenciales = BigDecimal.ZERO;

        for (Venta venta : ventas) {
            if (venta.getMetodoPago() == null || venta.getTotal() == null) {
                continue;
            }

            boolean esVenta = "venta".equalsIgnoreCase(venta.getTipoOperacion());
            boolean esDevolucion = "devolucion".equalsIgnoreCase(venta.getTipoOperacion());

            if (esVenta) {
                if (venta.getMetodoPago() == MetodoPagoVenta.EFECTIVO) {
                    ventasEfectivo = ventasEfectivo.add(venta.getTotal());
                } else if (venta.getMetodoPago() == MetodoPagoVenta.TRANSFERENCIA) {
                    ventasTransferencia = ventasTransferencia.add(venta.getTotal());
                }
            }

            if (esDevolucion) {
                BigDecimal montoPositivo = venta.getTotal().abs();

                if (venta.getMetodoPago() == MetodoPagoVenta.EFECTIVO) {
                    devolucionesEfectivo = devolucionesEfectivo.add(montoPositivo);
                } else if (venta.getMetodoPago() == MetodoPagoVenta.TRANSFERENCIA) {
                    devolucionesTransferencia = devolucionesTransferencia.add(montoPositivo);
                }
            }
        }

        for (RetiroGerencial retiro : retiros) {
            if (retiro.getMonto() != null) {
                retirosGerenciales = retirosGerenciales.add(retiro.getMonto());
            }
        }

        BigDecimal efectivoEsperado = ventasEfectivo
                .subtract(devolucionesEfectivo)
                .subtract(retirosGerenciales);

        ResumenCajaResponse response = new ResumenCajaResponse();
        response.setLocalId(localId);
        response.setFecha(fecha);
        response.setVentasEfectivo(ventasEfectivo);
        response.setVentasTransferencia(ventasTransferencia);
        response.setDevolucionesEfectivo(devolucionesEfectivo);
        response.setDevolucionesTransferencia(devolucionesTransferencia);
        response.setRetirosGerenciales(retirosGerenciales);
        response.setEfectivoEsperado(efectivoEsperado);

        return response;
    }
}