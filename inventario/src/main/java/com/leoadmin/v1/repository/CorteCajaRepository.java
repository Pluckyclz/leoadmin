package com.leoadmin.v1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.CorteCaja;

public interface CorteCajaRepository extends JpaRepository<CorteCaja, Integer> {

    List<CorteCaja> findByLocalIdOrderByFechaHoraDesc(Integer localId);

    List<CorteCaja> findByLocalIdAndFechaOperacionOrderByFechaHoraDesc(
            Integer localId,
            String fechaOperacion);
}