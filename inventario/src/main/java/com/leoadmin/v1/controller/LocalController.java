package com.leoadmin.v1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leoadmin.v1.entity.Local;
import com.leoadmin.v1.repository.LocalRepository;

@CrossOrigin(origins = "*")
@RestController
public class LocalController {

    private final LocalRepository localRepository;

    public LocalController(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    @GetMapping("/locales")
    public List<Local> listarLocales() {
        return localRepository.findAll()
                .stream()
                .filter(local -> Boolean.TRUE.equals(local.getActivo()))
                .toList();
    }
}