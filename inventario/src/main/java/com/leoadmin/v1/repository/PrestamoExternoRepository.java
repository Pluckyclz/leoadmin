package com.leoadmin.v1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.PrestamoExterno;
import com.leoadmin.v1.enums.EstadoPrestamoExterno;

public interface PrestamoExternoRepository extends JpaRepository<PrestamoExterno, Integer> {

    List<PrestamoExterno> findBySucursalOrigenIdOrderByFechaHoraDesc(Integer sucursalOrigenId);

    List<PrestamoExterno> findBySucursalOrigenIdAndEstadoOrderByFechaHoraDesc(
            Integer sucursalOrigenId,
            EstadoPrestamoExterno estado);

    boolean existsByFolio(String folio);
}