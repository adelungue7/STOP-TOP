package br.senac.tads.pi.demo.controller;

import br.senac.tads.pi.demo.model.Regras;
import br.senac.tads.pi.demo.service.RegrasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/regras")
public class RegrasController {

    @Autowired 
    private RegrasService service;

    @GetMapping
    public Regras carregar() {
        return service.getRegras();
    }

    @PostMapping
    public Regras salvar(@RequestBody Regras regras) {
        return service.salvar(regras);
    }
}