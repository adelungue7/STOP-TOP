package br.senac.tads.pi.demo.controller;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.service.GestaoService;
import br.senac.tads.pi.demo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gestao")
public class GestaoController {

    @Autowired 
    private GestaoService service;
    
    @Autowired 
    private ClienteRepository repo;

    @GetMapping("/mensalistas")
    public List<Cliente> listar() {
        return repo.findAll();
    }

    @PostMapping("/assinatura")
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(service.processarNovoMensalista(cliente));
    }
}