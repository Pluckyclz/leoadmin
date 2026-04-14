package com.leoadmin.v1.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.DevolucionRequest;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.UsuarioRepository;

@Service
public class DevolucionService {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final UsuarioRepository usuarioRepository;

    public DevolucionService(
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public String registrarDevolucion(DevolucionRequest request) {

        if (request.getCodigoBarras() == null || request.getCodigoBarras().isBlank()) {
            return "El código de barras es obligatorio";
        }

        if (request.getSucursalId() == null) {
            return "La sucursal es obligatoria";
        }

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            return "La cantidad debe ser mayor a 0";
        }

        if (request.getNumeroEmpleado() == null || request.getNumeroEmpleado().isBlank()) {
            return "El número de empleado es obligatorio";
        }

        Usuario usuario = usuarioRepository.findByNumeroEmpleado(request.getNumeroEmpleado()).orElse(null);
        if (usuario == null) {
            return "Empleado no válido";
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            return "Empleado inactivo";
        }

        if (!"admin".equalsIgnoreCase(usuario.getRol())) {
            return "Solo un administrador puede registrar devoluciones";
        }

        Producto producto = productoRepository.findByCodigoBarras(request.getCodigoBarras()).orElse(null);
        if (producto == null) {
            return "Producto no encontrado";
        }

        Inventario inventario = inventarioRepository
                .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalId())
                .orElse(null);

        if (inventario == null) {
            inventario = new Inventario();
            inventario.setProductoId(producto.getId());
            inventario.setSucursalId(request.getSucursalId());
            inventario.setCantidad(0);
        }

        inventario.setCantidad(inventario.getCantidad() + request.getCantidad());
        inventarioRepository.save(inventario);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProductoId(producto.getId());
        movimiento.setSucursalId(request.getSucursalId());
        movimiento.setTipoMovimiento("devolucion");
        movimiento.setCantidad(request.getCantidad());
        movimiento.setFechaHora(LocalDateTime.now());
        movimiento.setNumeroEmpleado(request.getNumeroEmpleado());
        movimiento.setObservacion(request.getMotivo());
        movimientoInventarioRepository.save(movimiento);

        return "Devolución registrada correctamente";
    }
}
