package com.leoadmin.v1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.leoadmin.v1.dto.MovimientoInventarioResponse;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;

@Service
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final ProductoRepository productoRepository;

    public MovimientoInventarioService(
            MovimientoInventarioRepository movimientoInventarioRepository,
            ProductoRepository productoRepository) {
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.productoRepository = productoRepository;
    }

    public List<MovimientoInventarioResponse> consultarMovimientos(
            Integer sucursalId,
            String tipoMovimiento) {

        boolean tieneSucursal = sucursalId != null;
        boolean tieneTipo = tipoMovimiento != null && !tipoMovimiento.isBlank();

        List<MovimientoInventario> movimientos;

        if (tieneSucursal && tieneTipo) {
            movimientos = movimientoInventarioRepository
                    .findBySucursalIdAndTipoMovimientoIgnoreCaseOrderByFechaHoraDesc(
                            sucursalId,
                            tipoMovimiento.trim());
        } else if (tieneSucursal) {
            movimientos = movimientoInventarioRepository
                    .findBySucursalIdOrderByFechaHoraDesc(sucursalId);
        } else if (tieneTipo) {
            movimientos = movimientoInventarioRepository
                    .findByTipoMovimientoIgnoreCaseOrderByFechaHoraDesc(tipoMovimiento.trim());
        } else {
            movimientos = movimientoInventarioRepository.findByOrderByFechaHoraDesc();
        }

        return movimientos.stream()
                .map(this::mapear)
                .toList();
    }

    private MovimientoInventarioResponse mapear(MovimientoInventario movimiento) {
        MovimientoInventarioResponse response = new MovimientoInventarioResponse();

        response.setId(movimiento.getId());
        response.setProductoId(movimiento.getProductoId());
        response.setSucursalId(movimiento.getSucursalId());
        response.setTipoMovimiento(movimiento.getTipoMovimiento());
        response.setCantidad(movimiento.getCantidad());
        response.setFechaHora(movimiento.getFechaHora());
        response.setNumeroEmpleado(movimiento.getNumeroEmpleado());
        response.setReferenciaId(movimiento.getReferenciaId());
        response.setObservacion(movimiento.getObservacion());

        Producto producto = productoRepository.findById(movimiento.getProductoId()).orElse(null);

        if (producto != null) {
            response.setCodigoBarras(producto.getCodigoBarras());
            response.setDescripcionProducto(producto.getDescripcion());
        }

        return response;
    }
}