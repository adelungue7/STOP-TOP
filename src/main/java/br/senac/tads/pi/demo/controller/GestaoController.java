package br.senac.tads.pi.demo.controller;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.model.TipoPlano;
import br.senac.tads.pi.demo.service.GestaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
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
	public ResponseEntity<Void> salvar(@RequestBody Map<String, String> p) {
		service.salvarOuAtualizar(map(p), p.get("placa"), parse(p.get("dataInicio")));
		return ResponseEntity.ok().build();
	}

	@PutMapping("/mensalistas/{cpf}")
	public ResponseEntity<Void> atualizar(@PathVariable String cpf, @RequestBody Map<String, String> p) {
		service.salvarOuAtualizar(map(p), p.get("placa"), parse(p.get("dataInicio")));
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/mensalistas/{cpf}")
	public ResponseEntity<Void> deletar(@PathVariable String cpf) {
		service.removerPlano(cpf);
		return ResponseEntity.noContent().build();
	}

	private Cliente map(Map<String, String> p) {
		Cliente c = new Cliente();
		c.setCpf(p.get("cpf"));
		c.setNome(p.get("nome"));
		c.setEmail(p.get("email"));
		c.setTelefone(p.get("telefone"));
		c.setEndereco(p.get("endereco"));
		c.setTipoPlano(TipoPlano.valueOf(p.get("tipoPlano")));
		return c;
	}

	private LocalDate parse(String d) {
		return (d != null && !d.isEmpty()) ? LocalDate.parse(d) : LocalDate.now();
	}
}
