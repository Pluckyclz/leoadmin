package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.service.ProductoService;

@RestController
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

    public ProductoController(
            ProductoRepository productoRepository,
            ProductoService productoService) {
        this.productoRepository = productoRepository;
        this.productoService = productoService;
    }

    @GetMapping("/productos")
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/productos/codigo/{codigoBarras}")
    public Producto buscarPorCodigoBarras(@PathVariable String codigoBarras) {
        return productoRepository.findByCodigoBarras(codigoBarras).orElse(null);
    }

    @PostMapping("/productos")
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PostMapping(value = "/productos/importar/{sucursalId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String importarProductos(
            @PathVariable Integer sucursalId,
            @RequestParam("excel") MultipartFile excel,
            @RequestParam("zipImagenes") MultipartFile zipImagenes) {

        return productoService.importarProductosDesdeArchivos(sucursalId, excel, zipImagenes);
    }
}