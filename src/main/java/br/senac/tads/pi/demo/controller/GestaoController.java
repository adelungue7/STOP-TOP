package br.senac.tads.pi.demo.controller;

import br.senac.tads.pi.demo.service.GestaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gestao")
public class GestaoController {

    @Autowired
    private GestaoService service;

    @GetMapping("/mensalistas")
    public List<Map<String, Object>> listar() {
        return service.listarMensalistasSincronizados();
    }

    @GetMapping("/mensalistas/{cpf}")
    public Map<String, Object> buscar(@PathVariable String cpf) {
        return service.buscarPorCpf(cpf);
    }

    @PostMapping("/assinatura")
    public ResponseEntity<Void> salvar(@RequestBody Map<String, String> payload) {
        service.salvarOuAtualizar(
            payload.get("cpf"),
            payload.get("placa"),
            payload.get("tipoPlano"),
            payload.get("dataInicio")
        );
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/mensalistas/{cpf}")
    public ResponseEntity<Void> remover(@PathVariable String cpf) {
        service.removerPlano(cpf);
        return ResponseEntity.ok().build();
    }
}
