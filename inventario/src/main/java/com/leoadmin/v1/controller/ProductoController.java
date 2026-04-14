package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.repository.ProductoRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
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
}
