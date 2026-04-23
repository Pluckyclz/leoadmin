package com.leoadmin.v1.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.RetiroGerencial;

public interface RetiroGerencialRepository extends JpaRepository<RetiroGerencial, Integer> {

    List<RetiroGerencial> findByLocalIdOrderByFechaHoraDesc(Integer localId);

    List<RetiroGerencial> findByLocalIdAndFechaHoraBetweenOrderByFechaHoraDesc(
            Integer localId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin);
}