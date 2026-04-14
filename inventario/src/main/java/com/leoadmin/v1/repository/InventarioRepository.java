package com.leoadmin.v1.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leoadmin.v1.entity.Inventario;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    Optional<Inventario> findByProductoIdAndSucursalId(Integer productoId, Integer sucursalId);

    List<Inventario> findBySucursalId(Integer sucursalId);

    @Modifying
    @Query("""
                UPDATE Inventario i
                SET i.cantidad = i.cantidad - :cantidad
                WHERE i.productoId = :productoId
                  AND i.sucursalId = :sucursalId
                  AND i.cantidad >= :cantidad
            """)
    int descontarStock(@Param("productoId") Integer productoId,
            @Param("sucursalId") Integer sucursalId,
            @Param("cantidad") Integer cantidad);

}
