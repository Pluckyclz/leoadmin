package com.leoadmin.v1.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leoadmin.v1.entity.Venta;

public interface VentaRepository extends JpaRepository<Venta, Integer> {

    List<Venta> findByLocalIdAndFechaHoraBetween(
            Integer localId,
            LocalDateTime inicio,
            LocalDateTime fin);
}