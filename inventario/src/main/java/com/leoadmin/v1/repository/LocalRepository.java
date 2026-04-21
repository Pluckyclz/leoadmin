package com.leoadmin.v1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.Local;

public interface LocalRepository extends JpaRepository<Local, Integer> {

    Optional<Local> findByIp(String ip);

    Optional<Local> findFirstByActivoTrueOrderByIdAsc();

    List<Local> findByActivoTrueOrderByNombreAsc();
}