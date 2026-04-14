package com.leoadmin.v1.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.Inventario;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    Optional<Inventario> findByProductoIdAndSucursalId(Integer productoId, Integer sucursalId);
    List<Inventario> findBySucursalId(Integer sucursalId);

}
