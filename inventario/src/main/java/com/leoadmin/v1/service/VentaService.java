package com.leoadmin.v1.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.DetalleVentaRequest;
import com.leoadmin.v1.dto.VentaRequest;
import com.leoadmin.v1.dto.VentaResponse;
import com.leoadmin.v1.entity.DetalleVenta;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.Venta;
import com.leoadmin.v1.repository.DetalleVentaRepository;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.VentaRepository;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.repository.UsuarioRepository;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final UsuarioRepository usuarioRepository;

    public VentaService(
            VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            UsuarioRepository usuarioRepository) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public VentaResponse procesarVenta(VentaRequest request) {

        VentaResponse error = new VentaResponse();

        Usuario usuario = usuarioRepository
                .findByNumeroEmpleado(request.getNumeroEmpleado())
                .orElse(null);

        if (usuario == null) {
            error = new VentaResponse();
            error.setMensaje("Empleado no válido");
            return error;
        }

        if (!usuario.getActivo()) {
            error = new VentaResponse();
            error.setMensaje("Empleado inactivo");
            return error;
        }

        if (request.getProductos() == null || request.getProductos().isEmpty()) {
            error.setMensaje("La venta debe incluir al menos un producto");
            return error;
        }

        if (!usuario.getSucursalId().equals(request.getSucursalId())) {
            error = new VentaResponse();
            error.setMensaje("El empleado no pertenece a la sucursal indicada");
            return error;
        }

        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (DetalleVentaRequest item : request.getProductos()) {

            if (item.getCodigoBarras() == null || item.getCodigoBarras().isBlank()) {
                error.setMensaje("Cada producto debe tener código de barras");
                return error;
            }

            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                error.setMensaje("Cada producto debe tener cantidad mayor a 0");
                return error;
            }

            Producto producto = productoRepository
                    .findByCodigoBarras(item.getCodigoBarras())
                    .orElse(null);

            if (producto == null) {
                error.setMensaje("Producto no encontrado: " + item.getCodigoBarras());
                return error;
            }

            Inventario inventario = inventarioRepository
                    .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalId())
                    .orElse(null);

            if (inventario == null) {
                error.setMensaje("Inventario no encontrado para el producto: " + item.getCodigoBarras());
                return error;
            }

            if (inventario.getCantidad() < item.getCantidad()) {
                error.setMensaje("Stock insuficiente para el producto: " + item.getCodigoBarras());
                return error;
            }

            BigDecimal precioUnitario;

            if ("especial".equalsIgnoreCase(request.getTipoVenta())) {
                precioUnitario = producto.getPrecioEspecial() != null
                        ? producto.getPrecioEspecial()
                        : producto.getPrecioVenta();
            } else {
                precioUnitario = producto.getPrecioVenta();
            }

            BigDecimal subtotal = precioUnitario
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            totalGeneral = totalGeneral.add(subtotal);
        }

        Venta venta = new Venta();
        venta.setSucursalId(request.getSucursalId());
        venta.setNumeroEmpleado(request.getNumeroEmpleado());
        venta.setFechaHora(LocalDateTime.now());
        venta.setTotal(totalGeneral);
        venta.setTipoOperacion("venta");

        Venta ventaGuardada = ventaRepository.save(venta);

        for (DetalleVentaRequest item : request.getProductos()) {

            Producto producto = productoRepository
                    .findByCodigoBarras(item.getCodigoBarras())
                    .orElse(null);

            Inventario inventario = inventarioRepository
                    .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalId())
                    .orElse(null);

            BigDecimal precioUnitario;

            if ("especial".equalsIgnoreCase(request.getTipoVenta())) {
                precioUnitario = producto.getPrecioEspecial() != null
                        ? producto.getPrecioEspecial()
                        : producto.getPrecioVenta();
            } else {
                precioUnitario = producto.getPrecioVenta();
            }

            BigDecimal subtotal = precioUnitario
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVentaId(ventaGuardada.getId());
            detalle.setProductoId(producto.getId());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);
            detalleVentaRepository.save(detalle);

            inventario.setCantidad(inventario.getCantidad() - item.getCantidad());
            inventarioRepository.save(inventario);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProductoId(producto.getId());
            movimiento.setSucursalId(request.getSucursalId());
            movimiento.setTipoMovimiento("venta");
            movimiento.setCantidad(item.getCantidad() * -1);
            movimiento.setFechaHora(LocalDateTime.now());
            movimiento.setNumeroEmpleado(request.getNumeroEmpleado());
            movimiento.setReferenciaId(ventaGuardada.getId());
            movimiento.setObservacion("Venta múltiple desde service");
            movimientoInventarioRepository.save(movimiento);
        }

        VentaResponse response = new VentaResponse();
        response.setVentaId(ventaGuardada.getId());
        response.setTotal(totalGeneral);
        response.setFechaHora(ventaGuardada.getFechaHora());
        response.setMensaje("Venta registrada correctamente");

        return response;
    }
}