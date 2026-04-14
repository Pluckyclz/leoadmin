package com.leoadmin.v1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.leoadmin.v1.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    Optional<Producto> findByCodigoBarras(String codigoBarras);
}