package com.leoadmin.v1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leoadmin.v1.entity.DetalleVenta;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
}