package com.leoadmin.v1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.MovimientoInventario;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Integer> {
    List<MovimientoInventario> findBySucursalIdOrderByFechaHoraDesc(Integer sucursalId);
}