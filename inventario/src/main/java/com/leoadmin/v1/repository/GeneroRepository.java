package com.leoadmin.v1.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.Genero;

public interface GeneroRepository extends JpaRepository<Genero, Integer> {

    Optional<Genero> findByNombreIgnoreCase(String nombre);
}