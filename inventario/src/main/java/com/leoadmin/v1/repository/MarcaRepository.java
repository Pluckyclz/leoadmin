package com.leoadmin.v1.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {

    Optional<Marca> findByNombreIgnoreCase(String nombre);
}