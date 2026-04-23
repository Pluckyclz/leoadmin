package com.leoadmin.v1.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leoadmin.v1.dto.DetalleVentaRequest;
import com.leoadmin.v1.dto.PrestamoExternoAccionRequest;
import com.leoadmin.v1.dto.PrestamoExternoRequest;
import com.leoadmin.v1.dto.PrestamoExternoResponse;
import com.leoadmin.v1.dto.VentaRequest;
import com.leoadmin.v1.dto.VentaResponse;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.MovimientoInventario;
import com.leoadmin.v1.entity.PrestamoExterno;
import com.leoadmin.v1.entity.PrestamoExternoDetalle;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.Usuario;
import com.leoadmin.v1.enums.EstadoPrestamoExterno;
import com.leoadmin.v1.enums.EstadoPrestamoExternoDetalle;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MovimientoInventarioRepository;
import com.leoadmin.v1.repository.PrestamoExternoDetalleRepository;
import com.leoadmin.v1.repository.PrestamoExternoRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.UsuarioRepository;

@Service
public class PrestamoExternoService {

    private final PrestamoExternoRepository prestamoExternoRepository;
    private final PrestamoExternoDetalleRepository prestamoExternoDetalleRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaService ventaService;

    public PrestamoExternoService(
            PrestamoExternoRepository prestamoExternoRepository,
            PrestamoExternoDetalleRepository prestamoExternoDetalleRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            UsuarioRepository usuarioRepository,
            VentaService ventaService) {
        this.prestamoExternoRepository = prestamoExternoRepository;
        this.prestamoExternoDetalleRepository = prestamoExternoDetalleRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.ventaService = ventaService;
    }

    @Transactional
    public PrestamoExternoResponse crearPrestamo(PrestamoExternoRequest request) {

        PrestamoExternoResponse response = new PrestamoExternoResponse();

        if (request.getSucursalOrigenId() == null) {
            response.setMensaje("La sucursal origen es obligatoria");
            return response;
        }

        if (request.getNumeroEmpleado() == null) {
            response.setMensaje("El número de empleado es obligatorio");
            return response;
        }

        if (request.getNombreLocalExterno() == null || request.getNombreLocalExterno().isBlank()) {
            response.setMensaje("El nombre o número del local externo es obligatorio");
            return response;
        }

        if (request.getCodigosBarras() == null || request.getCodigosBarras().isEmpty()) {
            response.setMensaje("Debes agregar al menos una pieza al préstamo");
            return response;
        }

        Usuario usuario = usuarioRepository.findByNumeroEmpleado(request.getNumeroEmpleado()).orElse(null);
        if (usuario == null) {
            response.setMensaje("Empleado no válido");
            return response;
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            response.setMensaje("Empleado inactivo");
            return response;
        }

        PrestamoExterno prestamo = new PrestamoExterno();
        prestamo.setFolio(generarFolio());
        prestamo.setSucursalOrigenId(request.getSucursalOrigenId());
        prestamo.setNumeroEmpleado(request.getNumeroEmpleado());
        prestamo.setNombreLocalExterno(request.getNombreLocalExterno().trim());
        prestamo.setFechaHora(LocalDateTime.now());
        prestamo.setEstado(EstadoPrestamoExterno.ABIERTO);
        prestamo.setObservacion(request.getObservacion());

        PrestamoExterno prestamoGuardado = prestamoExternoRepository.save(prestamo);

        int totalPiezas = 0;

        for (String codigoBarras : request.getCodigosBarras()) {

            if (codigoBarras == null || codigoBarras.isBlank()) {
                throw new RuntimeException("Hay códigos de barras vacíos en el préstamo");
            }

            Producto producto = productoRepository.findByCodigoBarras(codigoBarras.trim()).orElse(null);
            if (producto == null) {
                throw new RuntimeException("Producto no encontrado: " + codigoBarras);
            }

            Inventario inventario = inventarioRepository
                    .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalOrigenId())
                    .orElse(null);

            if (inventario == null) {
                throw new RuntimeException("Inventario no encontrado para el producto: " + codigoBarras);
            }

            if (inventario.getCantidad() == null || inventario.getCantidad() <= 0) {
                throw new RuntimeException("Sin existencia disponible para el producto: " + codigoBarras);
            }

            int filasActualizadas = inventarioRepository.descontarStock(
                    producto.getId(),
                    request.getSucursalOrigenId(),
                    1);

            if (filasActualizadas == 0) {
                throw new RuntimeException("No se pudo descontar inventario para: " + codigoBarras);
            }

            PrestamoExternoDetalle detalle = new PrestamoExternoDetalle();
            detalle.setPrestamoExternoId(prestamoGuardado.getId());
            detalle.setProductoId(producto.getId());
            detalle.setCodigoBarras(producto.getCodigoBarras());
            detalle.setEstadoDetalle(EstadoPrestamoExternoDetalle.PRESTADO);
            detalle.setFechaMovimiento(LocalDateTime.now());
            detalle.setObservacion("Préstamo externo a " + request.getNombreLocalExterno().trim());
            prestamoExternoDetalleRepository.save(detalle);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProductoId(producto.getId());
            movimiento.setSucursalId(request.getSucursalOrigenId());
            movimiento.setTipoMovimiento("prest_ext");
            movimiento.setCantidad(-1);
            movimiento.setFechaHora(LocalDateTime.now());
            movimiento.setNumeroEmpleado(String.valueOf(request.getNumeroEmpleado()));
            movimiento.setReferenciaId(prestamoGuardado.getId());
            movimiento.setObservacion("Préstamo externo folio " + prestamoGuardado.getFolio());
            movimientoInventarioRepository.save(movimiento);

            totalPiezas++;
        }

        response.setPrestamoId(prestamoGuardado.getId());
        response.setFolio(prestamoGuardado.getFolio());
        response.setSucursalOrigenId(prestamoGuardado.getSucursalOrigenId());
        response.setNumeroEmpleado(prestamoGuardado.getNumeroEmpleado());
        response.setNombreLocalExterno(prestamoGuardado.getNombreLocalExterno());
        response.setFechaHora(prestamoGuardado.getFechaHora());
        response.setEstado(prestamoGuardado.getEstado().name());
        response.setTotalPiezas(totalPiezas);
        response.setMensaje("Préstamo externo registrado correctamente");

        return response;
    }

    @Transactional
    public String devolverPieza(Integer prestamoId, PrestamoExternoAccionRequest request) {

        PrestamoExterno prestamo = validarPrestamoAbierto(prestamoId);

        PrestamoExternoDetalle detalle = validarDetallePrestado(prestamoId, request.getCodigoBarras());

        Producto producto = productoRepository.findById(detalle.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Inventario inventario = inventarioRepository
                .findByProductoIdAndSucursalId(producto.getId(), prestamo.getSucursalOrigenId())
                .orElse(null);

        if (inventario == null) {
            inventario = new Inventario();
            inventario.setProductoId(producto.getId());
            inventario.setSucursalId(prestamo.getSucursalOrigenId());
            inventario.setCantidad(0);
        }

        inventario.setCantidad(inventario.getCantidad() + 1);
        inventarioRepository.save(inventario);

        detalle.setEstadoDetalle(EstadoPrestamoExternoDetalle.DEVUELTO);
        detalle.setFechaMovimiento(LocalDateTime.now());
        detalle.setObservacion("Devuelta");
        prestamoExternoDetalleRepository.save(detalle);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProductoId(producto.getId());
        movimiento.setSucursalId(prestamo.getSucursalOrigenId());
        movimiento.setTipoMovimiento("dev_prest_ext");
        movimiento.setCantidad(1);
        movimiento.setFechaHora(LocalDateTime.now());
        movimiento.setNumeroEmpleado(String.valueOf(prestamo.getNumeroEmpleado()));
        movimiento.setReferenciaId(prestamo.getId());
        movimiento.setObservacion("Devolución préstamo externo folio " + prestamo.getFolio());
        movimientoInventarioRepository.save(movimiento);

        actualizarEstadoPrestamo(prestamo);

        return "Pieza devuelta correctamente";
    }

    @Transactional
    public String venderPieza(Integer prestamoId, PrestamoExternoAccionRequest request) {

        PrestamoExterno prestamo = validarPrestamoAbierto(prestamoId);
        validarEmpleado(request.getNumeroEmpleado());

        PrestamoExternoDetalle detalle = validarDetallePrestado(prestamoId, request.getCodigoBarras());

        DetalleVentaRequest detalleVentaRequest = new DetalleVentaRequest();
        detalleVentaRequest.setCodigoBarras(detalle.getCodigoBarras());
        detalleVentaRequest.setCantidad(1);

        VentaRequest ventaRequest = new VentaRequest();
        ventaRequest.setNumeroEmpleado(request.getNumeroEmpleado());
        ventaRequest.setTipoVenta("especial");
        ventaRequest.setMetodoPago(request.getMetodoPago());
        ventaRequest.setProductos(List.of(detalleVentaRequest));

        VentaResponse ventaResponse = ventaService.procesarVentaDesdePrestamoExterno(
                ventaRequest,
                prestamo.getSucursalOrigenId());

        if (ventaResponse.getVentaId() == null) {
            return ventaResponse.getMensaje() != null
                    ? ventaResponse.getMensaje()
                    : "No se pudo registrar la venta desde el préstamo";
        }

        detalle.setEstadoDetalle(EstadoPrestamoExternoDetalle.VENDIDO);
        detalle.setFechaMovimiento(LocalDateTime.now());
        detalle.setVentaId(ventaResponse.getVentaId());
        detalle.setObservacion(request.getObservacion());
        prestamoExternoDetalleRepository.save(detalle);

        actualizarEstadoPrestamo(prestamo);

        return "Pieza vendida correctamente. Venta #" + ventaResponse.getVentaId();
    }

    @Transactional
    public String marcarFaltante(Integer prestamoId, PrestamoExternoAccionRequest request) {

        PrestamoExterno prestamo = validarPrestamoAbierto(prestamoId);
        validarEmpleado(request.getNumeroEmpleado());

        PrestamoExternoDetalle detalle = validarDetallePrestado(prestamoId, request.getCodigoBarras());

        detalle.setEstadoDetalle(EstadoPrestamoExternoDetalle.FALTANTE);
        detalle.setFechaMovimiento(LocalDateTime.now());
        detalle.setObservacion(request.getObservacion());
        prestamoExternoDetalleRepository.save(detalle);

        actualizarEstadoPrestamo(prestamo);

        return "Pieza marcada como faltante";
    }

    private PrestamoExterno validarPrestamoAbierto(Integer prestamoId) {
        PrestamoExterno prestamo = prestamoExternoRepository.findById(prestamoId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (prestamo.getEstado() == EstadoPrestamoExterno.CERRADO) {
            throw new RuntimeException("El préstamo ya está cerrado");
        }

        return prestamo;
    }

    private void validarEmpleado(Integer numeroEmpleado) {
        if (numeroEmpleado == null) {
            throw new RuntimeException("El número de empleado es obligatorio");
        }

        Usuario usuario = usuarioRepository.findByNumeroEmpleado(numeroEmpleado).orElse(null);
        if (usuario == null) {
            throw new RuntimeException("Empleado no válido");
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new RuntimeException("Empleado inactivo");
        }
    }

    private PrestamoExternoDetalle validarDetallePrestado(Integer prestamoId, String codigoBarras) {
        if (codigoBarras == null || codigoBarras.isBlank()) {
            throw new RuntimeException("El código de barras es obligatorio");
        }

        Optional<PrestamoExternoDetalle> detalleOpt = prestamoExternoDetalleRepository
                .findByPrestamoExternoIdAndCodigoBarras(prestamoId, codigoBarras.trim());

        if (detalleOpt.isEmpty()) {
            throw new RuntimeException("La pieza no pertenece a este préstamo");
        }

        PrestamoExternoDetalle detalle = detalleOpt.get();

        if (detalle.getEstadoDetalle() != EstadoPrestamoExternoDetalle.PRESTADO) {
            throw new RuntimeException("La pieza ya no está pendiente dentro del préstamo");
        }

        return detalle;
    }

    private void actualizarEstadoPrestamo(PrestamoExterno prestamo) {
        long total = prestamoExternoDetalleRepository.countByPrestamoExternoId(prestamo.getId());
        long prestadas = prestamoExternoDetalleRepository.countByPrestamoExternoIdAndEstadoDetalle(
                prestamo.getId(),
                EstadoPrestamoExternoDetalle.PRESTADO);

        if (prestadas == total) {
            prestamo.setEstado(EstadoPrestamoExterno.ABIERTO);
        } else if (prestadas == 0) {
            prestamo.setEstado(EstadoPrestamoExterno.CERRADO);
        } else {
            prestamo.setEstado(EstadoPrestamoExterno.PARCIAL);
        }

        prestamoExternoRepository.save(prestamo);
    }

    private String generarFolio() {
        String base = "PEX-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String folio = base;
        int consecutivo = 1;

        while (prestamoExternoRepository.existsByFolio(folio)) {
            folio = base + "-" + consecutivo;
            consecutivo++;
        }

        return folio;
    }

    public List<PrestamoExterno> consultarPorSucursal(Integer sucursalOrigenId) {
        return prestamoExternoRepository.findBySucursalOrigenIdOrderByFechaHoraDesc(sucursalOrigenId);
    }

    public PrestamoExterno consultarPorId(Integer id) {
        return prestamoExternoRepository.findById(id).orElse(null);
    }

    public List<PrestamoExternoDetalle> consultarDetalle(Integer prestamoExternoId) {
        return prestamoExternoDetalleRepository.findByPrestamoExternoIdOrderByIdAsc(prestamoExternoId);
    }
}