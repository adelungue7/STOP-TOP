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

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Veiculo veiculo) {
        
        if (!service.proprietarioExiste(veiculo.getNomeProprietario())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Proprietário não encontrado. O cliente deve estar cadastrado no sistema.");
        }

        if (service.placaJaCadastrada(veiculo.getPlaca(), null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Já existe um veículo cadastrado com a placa: " + veiculo.getPlaca());
        }

        // ✅ NOVO: Bloqueia se a vaga estiver ocupada
        if (service.vagaJaOcupada(veiculo.getVaga(), null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("A vaga '" + veiculo.getVaga() + "' já está ocupada por outro veículo.");
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

        // ✅ NOVO: Bloqueia se a vaga estiver ocupada na hora da atualização
        if (service.vagaJaOcupada(veiculo.getVaga(), id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("A vaga '" + veiculo.getVaga() + "' já está ocupada por outro veículo.");
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