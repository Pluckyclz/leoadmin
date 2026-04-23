package com.leoadmin.v1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.PrestamoExternoDetalle;
import com.leoadmin.v1.enums.EstadoPrestamoExternoDetalle;

public interface PrestamoExternoDetalleRepository extends JpaRepository<PrestamoExternoDetalle, Integer> {

    List<PrestamoExternoDetalle> findByPrestamoExternoIdOrderByIdAsc(Integer prestamoExternoId);

    Optional<PrestamoExternoDetalle> findByPrestamoExternoIdAndCodigoBarras(
            Integer prestamoExternoId,
            String codigoBarras);

    long countByPrestamoExternoId(Integer prestamoExternoId);

    long countByPrestamoExternoIdAndEstadoDetalle(
            Integer prestamoExternoId,
            EstadoPrestamoExternoDetalle estadoDetalle);
}