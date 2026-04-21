package com.leoadmin.v1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leoadmin.v1.entity.Marca;
import com.leoadmin.v1.entity.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Integer> {

    Optional<Modelo> findByNombreIgnoreCaseAndMarca(String nombre, Marca marca);

    List<Modelo> findByMarcaIdAndActivoTrueOrderByNombreAsc(Integer marcaId);
}