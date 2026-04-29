package com.leoadmin.v1.service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Enumeration;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.leoadmin.v1.dto.ProductoManualRequest;
import com.leoadmin.v1.entity.Categoria;
import com.leoadmin.v1.entity.Genero;
import com.leoadmin.v1.entity.Inventario;
import com.leoadmin.v1.entity.Marca;
import com.leoadmin.v1.entity.Modelo;
import com.leoadmin.v1.entity.Producto;
import com.leoadmin.v1.entity.TipoFunda;
import com.leoadmin.v1.repository.CategoriaRepository;
import com.leoadmin.v1.repository.GeneroRepository;
import com.leoadmin.v1.repository.InventarioRepository;
import com.leoadmin.v1.repository.MarcaRepository;
import com.leoadmin.v1.repository.ModeloRepository;
import com.leoadmin.v1.repository.ProductoRepository;
import com.leoadmin.v1.repository.TipoFundaRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final ModeloRepository modeloRepository;
    private final TipoFundaRepository tipoFundaRepository;
    private final GeneroRepository generoRepository;

    public ProductoService(
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            CategoriaRepository categoriaRepository,
            MarcaRepository marcaRepository,
            ModeloRepository modeloRepository,
            TipoFundaRepository tipoFundaRepository,
            GeneroRepository generoRepository) {
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.modeloRepository = modeloRepository;
        this.tipoFundaRepository = tipoFundaRepository;
        this.generoRepository = generoRepository;
    }

    public String generarCodigoBarras() {
        long count = productoRepository.count() + 1;
        return "LEO" + String.format("%08d", count);
    }

    @Transactional
    public String importarProductosDesdeArchivos(
            Integer sucursalId,
            MultipartFile excel,
            MultipartFile zipImagenes) {

        if (sucursalId == null) {
            return "La sucursal es obligatoria";
        }

        if (excel == null || excel.isEmpty()) {
            return "El archivo Excel es obligatorio";
        }

        if (zipImagenes == null || zipImagenes.isEmpty()) {
            return "El archivo ZIP de imágenes es obligatorio";
        }

        Path tempZipPath = null;

        int importados = 0;
        int rechazados = 0;
        StringBuilder errores = new StringBuilder();

        try {
            tempZipPath = Files.createTempFile("imagenes-productos-", ".zip");
            zipImagenes.transferTo(tempZipPath.toFile());

            Path uploadDir = Paths.get("uploads", "productos");
            Files.createDirectories(uploadDir);

            try (InputStream inputStream = excel.getInputStream();
                    Workbook workbook = new XSSFWorkbook(inputStream);
                    ZipFile zipFile = new ZipFile(tempZipPath.toFile())) {

                Sheet sheet = workbook.getSheetAt(0);
                DataFormatter formatter = new DataFormatter();

                if (sheet.getPhysicalNumberOfRows() <= 1) {
                    return "El Excel no contiene filas de datos";
                }

                for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    int numeroFila = i + 1;

                    if (row == null || filaVacia(row, formatter)) {
                        continue;
                    }

                    String claveImagen = getCell(row, 0, formatter);
                    String descripcion = getCell(row, 1, formatter);
                    String categoria = getCell(row, 2, formatter);
                    String marcaCelular = getCell(row, 3, formatter);
                    String modeloCelular = getCell(row, 4, formatter);
                    String tipoFunda = getCell(row, 5, formatter);
                    String genero = getCell(row, 6, formatter);
                    BigDecimal precioVenta = getDecimalCell(row, 7, formatter);
                    BigDecimal precioProveedor = getDecimalCell(row, 8, formatter);
                    BigDecimal precioEspecial = getDecimalCell(row, 9, formatter);
                    String proveedor = getCell(row, 10, formatter);
                    Integer cantidad = getIntegerCell(row, 11, formatter);

                    if (descripcion == null || descripcion.isBlank()) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila).append(": descripción obligatoria.\n");
                        continue;
                    }

                    if (precioVenta == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": precio de venta obligatorio o inválido.\n");
                        continue;
                    }

                    if (cantidad == null || cantidad < 0) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila).append(": cantidad inválida.\n");
                        continue;
                    }

                    Categoria categoriaObj = buscarCategoria(categoria);
                    if (categoriaObj == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": categoría no existe -> ")
                                .append(valorSeguro(categoria))
                                .append(".\n");
                        continue;
                    }

                    Marca marcaObj = buscarMarca(marcaCelular);
                    if (marcaObj == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": marca no existe -> ")
                                .append(valorSeguro(marcaCelular))
                                .append(".\n");
                        continue;
                    }

                    Modelo modeloObj = buscarModeloPorMarca(modeloCelular, marcaObj);
                    if (modeloObj == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": modelo no existe para la marca ")
                                .append(marcaObj.getNombre())
                                .append(" -> ")
                                .append(valorSeguro(modeloCelular))
                                .append(".\n");
                        continue;
                    }

                    TipoFunda tipoFundaObj = buscarTipoFunda(tipoFunda);
                    if (tipoFundaObj == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": tipo de funda no existe -> ")
                                .append(valorSeguro(tipoFunda))
                                .append(".\n");
                        continue;
                    }

                    Genero generoObj = buscarGenero(genero);
                    if (generoObj == null) {
                        rechazados++;
                        errores.append("Fila ").append(numeroFila)
                                .append(": género no existe -> ")
                                .append(valorSeguro(genero))
                                .append(".\n");
                        continue;
                    }

                    String codigo = generarCodigoBarras();

                    Producto producto = new Producto();
                    producto.setCodigoBarras(codigo);
                    producto.setDescripcion(descripcion.trim());

                    producto.setCategoriaObj(categoriaObj);
                    producto.setCategoria(categoriaObj.getNombre());

                    producto.setMarca(marcaObj);
                    producto.setMarcaCelular(marcaObj.getNombre());

                    producto.setModelo(modeloObj);
                    producto.setModeloCelular(modeloObj.getNombre());

                    producto.setTipoFundaObj(tipoFundaObj);
                    producto.setTipoFunda(tipoFundaObj.getNombre());

                    producto.setGeneroObj(generoObj);
                    producto.setGenero(generoObj.getNombre());

                    producto.setPrecioVenta(precioVenta);
                    producto.setPrecioProveedor(precioProveedor);
                    producto.setPrecioEspecial(precioEspecial);
                    producto.setProveedor(proveedor);
                    producto.setActivo(true);

                    if (claveImagen != null && !claveImagen.isBlank()) {
                        String nombreFinalImagen = guardarImagenDesdeZip(
                                zipFile,
                                claveImagen.trim(),
                                codigo,
                                uploadDir);

                        if (nombreFinalImagen != null) {
                            producto.setImagenUrl(nombreFinalImagen);
                        }
                    }

                    Producto productoGuardado = productoRepository.save(producto);

                    Optional<Inventario> inventarioExistente = inventarioRepository
                            .findByProductoIdAndSucursalId(productoGuardado.getId(), sucursalId);

                    if (inventarioExistente.isPresent()) {
                        Inventario inventario = inventarioExistente.get();
                        inventario.setCantidad(inventario.getCantidad() + cantidad);
                        inventarioRepository.save(inventario);
                    } else {
                        Inventario inventario = new Inventario();
                        inventario.setProductoId(productoGuardado.getId());
                        inventario.setSucursalId(sucursalId);
                        inventario.setCantidad(cantidad);
                        inventarioRepository.save(inventario);
                    }

                    importados++;
                }
            }

            StringBuilder respuesta = new StringBuilder();
            respuesta.append("Carga masiva finalizada. ");
            respuesta.append("Importados: ").append(importados);
            respuesta.append(" | Rechazados: ").append(rechazados);

            if (errores.length() > 0) {
                respuesta.append("\n\nErrores:\n").append(errores);
            }

            return respuesta.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error al procesar carga masiva: " + e.getMessage();
        } finally {
            try {
                if (tempZipPath != null) {
                    Files.deleteIfExists(tempZipPath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Transactional
    public String crearProductoManual(ProductoManualRequest request) {

        Producto producto = new Producto();

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoriaObj(categoria);
            producto.setCategoria(categoria.getNombre());
        } else {
            producto.setCategoria(request.getCategoria());
        }

        if (request.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(request.getMarcaId())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            producto.setMarca(marca);
            producto.setMarcaCelular(marca.getNombre());
        } else {
            producto.setMarcaCelular(request.getMarcaCelular());
        }

        if (request.getModeloId() != null) {
            Modelo modelo = modeloRepository.findById(request.getModeloId())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            producto.setModelo(modelo);
            producto.setModeloCelular(modelo.getNombre());
        } else {
            producto.setModeloCelular(request.getModeloCelular());
        }

        if (request.getTipoFundaId() != null) {
            TipoFunda tipo = tipoFundaRepository.findById(request.getTipoFundaId())
                    .orElseThrow(() -> new RuntimeException("Tipo de funda no encontrado"));
            producto.setTipoFundaObj(tipo);
            producto.setTipoFunda(tipo.getNombre());
        } else {
            producto.setTipoFunda(request.getTipoFunda());
        }

        if (request.getGeneroId() != null) {
            Genero genero = generoRepository.findById(request.getGeneroId())
                    .orElseThrow(() -> new RuntimeException("Género no encontrado"));
            producto.setGeneroObj(genero);
            producto.setGenero(genero.getNombre());
        } else {
            producto.setGenero(request.getGenero());
        }

        producto.setDescripcion(request.getDescripcion());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setProveedor(request.getProveedor());
        producto.setPrecioProveedor(request.getPrecioProveedor());
        producto.setPrecioEspecial(request.getPrecioEspecial());

        if (request.getCodigoBarras() != null && !request.getCodigoBarras().isBlank()) {
            producto.setCodigoBarras(request.getCodigoBarras().trim());
        } else {
            producto.setCodigoBarras(generarCodigoBarras());
        }

        producto.setActivo(request.getActivo() != null ? request.getActivo() : true);

        productoRepository.save(producto);

        if (request.getSucursalId() != null && request.getCantidadInicial() != null) {
            Optional<Inventario> existente = inventarioRepository
                    .findByProductoIdAndSucursalId(producto.getId(), request.getSucursalId());

            if (existente.isPresent()) {
                Inventario inv = existente.get();
                inv.setCantidad(inv.getCantidad() + request.getCantidadInicial());
                inventarioRepository.save(inv);
            } else {
                Inventario inv = new Inventario();
                inv.setProductoId(producto.getId());
                inv.setSucursalId(request.getSucursalId());
                inv.setCantidad(request.getCantidadInicial());
                inventarioRepository.save(inv);
            }
        }

        return "Producto creado correctamente";
    }

    @Transactional
    public String editarProductoManual(Integer id, ProductoManualRequest request) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoriaObj(categoria);
            producto.setCategoria(categoria.getNombre());
        }

        if (request.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(request.getMarcaId())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            producto.setMarca(marca);
            producto.setMarcaCelular(marca.getNombre());
        }

        if (request.getModeloId() != null) {
            Modelo modelo = modeloRepository.findById(request.getModeloId())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            producto.setModelo(modelo);
            producto.setModeloCelular(modelo.getNombre());
        }

        if (request.getTipoFundaId() != null) {
            TipoFunda tipo = tipoFundaRepository.findById(request.getTipoFundaId())
                    .orElseThrow(() -> new RuntimeException("Tipo de funda no encontrado"));
            producto.setTipoFundaObj(tipo);
            producto.setTipoFunda(tipo.getNombre());
        }

        if (request.getGeneroId() != null) {
            Genero genero = generoRepository.findById(request.getGeneroId())
                    .orElseThrow(() -> new RuntimeException("Género no encontrado"));
            producto.setGeneroObj(genero);
            producto.setGenero(genero.getNombre());
        }

        producto.setDescripcion(request.getDescripcion());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setProveedor(request.getProveedor());
        producto.setPrecioProveedor(request.getPrecioProveedor());
        producto.setPrecioEspecial(request.getPrecioEspecial());

        productoRepository.save(producto);

        return "Producto actualizado correctamente";
    }

    private Categoria buscarCategoria(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return null;
        }

        return categoriaRepository.findByNombreIgnoreCase(nombre.trim()).orElse(null);
    }

    private Marca buscarMarca(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return null;
        }

        return marcaRepository.findByNombreIgnoreCase(nombre.trim()).orElse(null);
    }

    private Modelo buscarModeloPorMarca(String nombre, Marca marca) {
        if (nombre == null || nombre.isBlank() || marca == null) {
            return null;
        }

        return modeloRepository.findByNombreIgnoreCaseAndMarca(nombre.trim(), marca).orElse(null);
    }

    private TipoFunda buscarTipoFunda(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return null;
        }

        return tipoFundaRepository.findByNombreIgnoreCase(nombre.trim()).orElse(null);
    }

    private Genero buscarGenero(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return null;
        }

        return generoRepository.findByNombreIgnoreCase(nombre.trim()).orElse(null);
    }

    private String valorSeguro(String valor) {
        return valor == null || valor.isBlank() ? "(vacío)" : valor.trim();
    }

    private boolean filaVacia(Row row, DataFormatter formatter) {
        for (int i = 0; i < 12; i++) {
            String value = getCell(row, i, formatter);
            if (value != null && !value.isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String getCell(Row row, int index, DataFormatter formatter) {
        if (row.getCell(index) == null) {
            return null;
        }
        String value = formatter.formatCellValue(row.getCell(index));
        return value != null ? value.trim() : null;
    }

    private BigDecimal getDecimalCell(Row row, int index, DataFormatter formatter) {
        String value = getCell(row, index, formatter);
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return new BigDecimal(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer getIntegerCell(Row row, int index, DataFormatter formatter) {
        String value = getCell(row, index, formatter);
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String guardarImagenDesdeZip(
            ZipFile zipFile,
            String claveImagen,
            String codigoBarras,
            Path uploadDir) throws IOException {

        ZipEntry entry = buscarEntradaImagen(zipFile, claveImagen);

        if (entry == null) {
            return null;
        }

        String extension = obtenerExtension(entry.getName());
        String nombreFinal = codigoBarras + extension;
        Path destino = uploadDir.resolve(nombreFinal);

        try (InputStream imageStream = zipFile.getInputStream(entry)) {
            Files.copy(imageStream, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        return nombreFinal;
    }

    private ZipEntry buscarEntradaImagen(ZipFile zipFile, String claveImagen) {
        Enumeration<? extends ZipEntry> entries = zipFile.entries();

        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();

            if (entry.isDirectory()) {
                continue;
            }

            String fileName = Paths.get(entry.getName()).getFileName().toString();
            String baseName = quitarExtension(fileName);

            if (claveImagen.equalsIgnoreCase(baseName)) {
                return entry;
            }
        }

        return null;
    }

    private String quitarExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
    }

    private String obtenerExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot >= 0 ? fileName.substring(lastDot) : ".jpg";
    }
}