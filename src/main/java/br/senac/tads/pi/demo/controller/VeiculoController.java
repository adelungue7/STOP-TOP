package br.senac.tads.pi.demo.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.senac.tads.pi.demo.model.Veiculo;
import br.senac.tads.pi.demo.service.VeiculoService;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService service;

    public VeiculoController(VeiculoService service) {
        this.service = service;
    }

    // Cadastrar novo veículo usando IF para validação
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Veiculo veiculo) {
        
        // 1. Verifica se o proprietário existe
        if (!service.proprietarioExiste(veiculo.getNomeProprietario())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Proprietário não encontrado. O cliente deve estar cadastrado no sistema.");
        }

        // 2. Verifica se a placa já existe
        if (service.placaJaCadastrada(veiculo.getPlaca(), null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Já existe um veículo cadastrado com a placa: " + veiculo.getPlaca());
        }

        Veiculo salvo = service.criarVeiculo(veiculo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Veiculo>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/placa/{placa}")
    public ResponseEntity<Veiculo> buscarPorPlaca(@PathVariable String placa) {
        return service.buscarPorPlaca(placa)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar veículo usando IF para validação
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Veiculo veiculo) {
        
        if (!service.proprietarioExiste(veiculo.getNomeProprietario())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Proprietário não encontrado. O cliente deve estar cadastrado no sistema.");
        }

        if (service.placaJaCadastrada(veiculo.getPlaca(), id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Já existe um veículo cadastrado com a placa: " + veiculo.getPlaca());
        }

        Veiculo atualizado = service.atualizar(id, veiculo);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}