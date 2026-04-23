package com.leoadmin.v1.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.leoadmin.v1.dto.ProductoManualRequest;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.service.ProductoService;

@RestController
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

    private final String UPLOAD_DIR = "C:/Users/Oscar/Documents/Proyecto Leoadmin/workspace/uploads/productos/";

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

    @GetMapping("/productos/{id}")
    public Producto buscarPorId(@PathVariable Integer id) {
        return productoRepository.findById(id).orElse(null);
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

    @PostMapping("/productos/manual")
    public String crearProductoManual(@RequestBody ProductoManualRequest request) {
        return productoService.crearProductoManual(request);
    }

    @PutMapping("/productos/manual/{id}")
    public String editarProductoManual(
            @PathVariable Integer id,
            @RequestBody ProductoManualRequest request) {
        return productoService.editarProductoManual(id, request);
    }

    @PostMapping(value = "/productos/{id}/imagen", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String subirImagen(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {

        try {
            Producto producto = productoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (file.isEmpty()) {
                throw new RuntimeException("Archivo vacío");
            }

            String original = file.getOriginalFilename();
            String extension = ".jpg";

            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf("."));
            }

            String nombreArchivo = producto.getCodigoBarras() + extension;

            Path path = Paths.get(UPLOAD_DIR + nombreArchivo);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            producto.setImagenUrl(nombreArchivo);
            productoRepository.save(producto);

            return "Imagen subida correctamente";

        } catch (IOException e) {
            e.printStackTrace();
            return "Error al subir imagen";
        }
    }
}