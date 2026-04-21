package com.leoadmin.v1.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.TipoFunda;

public interface TipoFundaRepository extends JpaRepository<TipoFunda, Integer> {

    Optional<TipoFunda> findByNombreIgnoreCase(String nombre);
}