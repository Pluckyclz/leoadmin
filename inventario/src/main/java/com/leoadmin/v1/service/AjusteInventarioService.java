package com.leoadmin.v1.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.AjusteInventarioRequest;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.enums.RolUsuario;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.UsuarioRepository;

@Service
public class AjusteInventarioService {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final UsuarioRepository usuarioRepository;

    public AjusteInventarioService(
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
    public String ajustarInventario(AjusteInventarioRequest request) {

        if (request.getCodigoBarras() == null || request.getCodigoBarras().isBlank()) {
            return "El código de barras es obligatorio";
        }

        if (request.getSucursalId() == null) {
            return "La sucursal es obligatoria";
        }

        if (request.getNuevaCantidad() == null || request.getNuevaCantidad() < 0) {
            return "La nueva cantidad no puede ser negativa";
        }

        if (request.getNumeroEmpleado() == null || request.getNumeroEmpleado().isBlank()) {
            return "El número de empleado es obligatorio";
        }

        Integer numeroEmpleado;
        try {
            numeroEmpleado = Integer.valueOf(request.getNumeroEmpleado());
        } catch (NumberFormatException e) {
            return "El número de empleado debe ser numérico";
        }

        Usuario usuario = usuarioRepository.findByNumeroEmpleado(numeroEmpleado).orElse(null);
        if (usuario == null) {
            return "Empleado no válido";
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            return "Empleado inactivo";
        }

        if (usuario.getRol() != RolUsuario.ADMIN && usuario.getRol() != RolUsuario.SUPER_ADMIN) {
            return "Solo un administrador puede ajustar inventario";
        }

        Producto producto = productoRepository.findByCodigoBarras(request.getCodigoBarras()).orElse(null);
        if (producto == null) {
            return "Producto no encontrado";
        }

        Inventario inventario = inventarioRepository
                .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalId())
                .orElse(null);

        int cantidadAnterior = inventario != null ? inventario.getCantidad() : 0;
        int diferencia = request.getNuevaCantidad() - cantidadAnterior;

        if (inventario == null) {
            inventario = new Inventario();
            inventario.setProductoId(producto.getId());
            inventario.setSucursalId(request.getSucursalId());
        }

        inventario.setCantidad(request.getNuevaCantidad());
        inventarioRepository.save(inventario);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProductoId(producto.getId());
        movimiento.setSucursalId(request.getSucursalId());
        movimiento.setTipoMovimiento("ajuste");
        movimiento.setCantidad(diferencia);
        movimiento.setFechaHora(LocalDateTime.now());
        movimiento.setNumeroEmpleado(request.getNumeroEmpleado());
        movimiento.setObservacion(request.getMotivo());
        movimientoInventarioRepository.save(movimiento);

        return "Ajuste registrado correctamente";
    }
}