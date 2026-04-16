package com.leoadmin.v1.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.DetalleVentaRequest;
import com.leoadmin.v1.dto.VentaRequest;
import com.leoadmin.v1.dto.VentaResponse;
import com.leoadmin.v1.entity.DetalleVenta;
import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.entity.Venta;
import com.leoadmin.v1.repository.DetalleVentaRepository;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.UsuarioRepository;
import com.leoadmin.v1.repository.VentaRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final LocalService localService;

    public VentaService(
            VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            UsuarioRepository usuarioRepository,
            LocalService localService) {

        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.localService = localService;
    }

    @Transactional
    public VentaResponse procesarVenta(VentaRequest request, HttpServletRequest httpRequest) {

        VentaResponse error = new VentaResponse();

        Local local = localService.obtenerLocalDesdeRequest(httpRequest);

        if (local == null) {
            error.setMensaje("No se pudo identificar el local desde la IP");
            return error;
        }

        Integer localId = local.getId();

        if (request.getNumeroEmpleado() == null) {
            error.setMensaje("El número de empleado es obligatorio");
            return error;
        }

        if (request.getProductos() == null || request.getProductos().isEmpty()) {
            error.setMensaje("La venta debe incluir al menos un producto");
            return error;
        }

        Usuario usuario = usuarioRepository
                .findByNumeroEmpleado(request.getNumeroEmpleado())
                .orElse(null);

        if (usuario == null) {
            error.setMensaje("Empleado no válido");
            return error;
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            error.setMensaje("Empleado inactivo");
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

            var inventarioOpt = inventarioRepository
                    .findByProductoIdAndSucursalId(producto.getId(), localId);

            if (inventarioOpt.isEmpty()) {
                error.setMensaje("Inventario no encontrado para el producto: " + item.getCodigoBarras());
                return error;
            }

            if (inventarioOpt.get().getCantidad() < item.getCantidad()) {
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

            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));
            totalGeneral = totalGeneral.add(subtotal);
        }

        Venta venta = new Venta();
        venta.setLocalId(localId);
        venta.setNumeroEmpleado(request.getNumeroEmpleado());
        venta.setFechaHora(LocalDateTime.now());
        venta.setTotal(totalGeneral);
        venta.setTipoOperacion("venta");

        Venta ventaGuardada = ventaRepository.save(venta);

        for (DetalleVentaRequest item : request.getProductos()) {

            Producto producto = productoRepository
                    .findByCodigoBarras(item.getCodigoBarras())
                    .orElse(null);

            if (producto == null) {
                throw new RuntimeException("Producto no encontrado durante el guardado: " + item.getCodigoBarras());
            }

            BigDecimal precioUnitario;

            if ("especial".equalsIgnoreCase(request.getTipoVenta())) {
                precioUnitario = producto.getPrecioEspecial() != null
                        ? producto.getPrecioEspecial()
                        : producto.getPrecioVenta();
            } else {
                precioUnitario = producto.getPrecioVenta();
            }

            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));

            int filasActualizadas = inventarioRepository.descontarStock(
                    producto.getId(),
                    localId,
                    item.getCantidad());

            if (filasActualizadas == 0) {
                throw new RuntimeException(
                        "Stock insuficiente o inventario modificado simultáneamente para: " + item.getCodigoBarras());
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVentaId(ventaGuardada.getId());
            detalle.setProductoId(producto.getId());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);
            detalleVentaRepository.save(detalle);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProductoId(producto.getId());
            movimiento.setSucursalId(localId);
            movimiento.setTipoMovimiento("venta");
            movimiento.setCantidad(item.getCantidad() * -1);
            movimiento.setFechaHora(LocalDateTime.now());
            movimiento.setNumeroEmpleado(String.valueOf(request.getNumeroEmpleado()));
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