package br.senac.tads.pi.demo.controller;

import br.senac.tads.pi.demo.model.Pagamento;
import br.senac.tads.pi.demo.service.PagamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {

    private final PagamentoService service;

    public PagamentoController(PagamentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Pagamento> realizarPagamento(@RequestBody Pagamento pagamento) {
        Pagamento salvo = service.realizarPagamento(pagamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Pagamento>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
}

