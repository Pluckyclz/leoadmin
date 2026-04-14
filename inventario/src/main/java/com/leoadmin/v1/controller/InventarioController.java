package com.leoadmin.v1.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leoadmin.v1.dto.InventarioResponse;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.ProductoRepository;

@CrossOrigin(origins = "*")
@RestController
public class InventarioController {

    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;

    public InventarioController(InventarioRepository inventarioRepository,
            ProductoRepository productoRepository) {
        this.inventarioRepository = inventarioRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping("/inventario/sucursal/{sucursalId}")
    public List<InventarioResponse> consultarPorSucursal(@PathVariable Integer sucursalId) {

        List<Inventario> inventarios = inventarioRepository.findBySucursalId(sucursalId);
        List<InventarioResponse> respuesta = new ArrayList<>();

        for (Inventario inventario : inventarios) {
            Producto producto = productoRepository.findById(inventario.getProductoId()).orElse(null);

            if (producto != null) {
                InventarioResponse item = new InventarioResponse();
                item.setProductoId(producto.getId());
                item.setCategoria(producto.getCategoria());
                item.setMarcaCelular(producto.getMarcaCelular());
                item.setModeloCelular(producto.getModeloCelular());
                item.setTipoFunda(producto.getTipoFunda());
                item.setGenero(producto.getGenero());
                item.setPrecioVenta(producto.getPrecioVenta());
                item.setCodigoBarras(producto.getCodigoBarras());
                item.setCantidad(inventario.getCantidad());

                respuesta.add(item);
            }
        }

        return respuesta;
    }

    @GetMapping("/inventario/sucursal/{sucursalId}/filtro")
    public List<InventarioResponse> consultarPorSucursalFiltrado(
            @PathVariable Integer sucursalId,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) String genero) {

        List<Inventario> inventarios = inventarioRepository.findBySucursalId(sucursalId);
        List<InventarioResponse> respuesta = new ArrayList<>();

        for (Inventario inventario : inventarios) {
            Producto producto = productoRepository.findById(inventario.getProductoId()).orElse(null);

            if (producto != null) {
                boolean coincide = true;

                if (marca != null && !marca.isBlank()
                        && !producto.getMarcaCelular().equalsIgnoreCase(marca)) {
                    coincide = false;
                }

                if (modelo != null && !modelo.isBlank()
                        && !producto.getModeloCelular().equalsIgnoreCase(modelo)) {
                    coincide = false;
                }

                if (genero != null && !genero.isBlank()
                        && !producto.getGenero().equalsIgnoreCase(genero)) {
                    coincide = false;
                }

                if (coincide) {
                    InventarioResponse item = new InventarioResponse();
                    item.setProductoId(producto.getId());
                    item.setCategoria(producto.getCategoria());
                    item.setMarcaCelular(producto.getMarcaCelular());
                    item.setModeloCelular(producto.getModeloCelular());
                    item.setTipoFunda(producto.getTipoFunda());
                    item.setGenero(producto.getGenero());
                    item.setPrecioVenta(producto.getPrecioVenta());
                    item.setCodigoBarras(producto.getCodigoBarras());
                    item.setCantidad(inventario.getCantidad());

                    respuesta.add(item);
                }
            }
        }

        return respuesta;
    }
}
