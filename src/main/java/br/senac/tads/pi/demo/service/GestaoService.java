package br.senac.tads.pi.demo.service;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.model.Veiculo;
import br.senac.tads.pi.demo.repository.ClienteRepository;
import br.senac.tads.pi.demo.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GestaoService {

	@Autowired
	private ClienteRepository clienteRepo;

	@Autowired
	private VeiculoRepository veiculoRepo;

	public List<Map<String, Object>> listarMensalistasSincronizados() {
		return clienteRepo.findAll().stream()
			.filter(c -> c.getTipoPlano() != null && !c.getTipoPlano().name().equals("DIARIO"))
			.map(c -> {
				var veiculo = veiculoRepo.findAll().stream()
					.filter(v -> v.getNomeProprietario() != null && v.getNomeProprietario().equalsIgnoreCase(c.getNome()))
					.findFirst();

				if (veiculo.isEmpty()) return null;

				return Map.<String, Object>of(
					"cpf", c.getCpf(),
					"nome", c.getNome(),
					"email", c.getEmail(),
					"telefone", c.getTelefone(),
					"endereco", c.getEndereco() != null ? c.getEndereco() : "",
					"tipoPlano", c.getTipoPlano().name(),
					"vencimento", c.getDataNascimento(),
					"placa", veiculo.get().getPlaca()
				);
			})
			.filter(java.util.Objects::nonNull)
			.collect(Collectors.toList());
	}

	@Transactional
	public void salvarOuAtualizar(Cliente dados, String placa, LocalDate inicio) {
		Cliente c = clienteRepo.findById(dados.getCpf()).orElse(dados);

		LocalDate fim = (inicio != null) ? inicio : LocalDate.now();
		if ("TRIMESTRAL".equals(dados.getTipoPlano().name())) fim = fim.plusMonths(3);
		else if ("SEMESTRAL".equals(dados.getTipoPlano().name())) fim = fim.plusMonths(6);
		else fim = fim.plusMonths(1);

		c.setNome(dados.getNome());
		c.setEmail(dados.getEmail());
		c.setTelefone(dados.getTelefone());
		c.setEndereco(dados.getEndereco());
		c.setTipoPlano(dados.getTipoPlano());
		c.setDataNascimento(fim);
		clienteRepo.save(c);

		Veiculo v = veiculoRepo.findByPlaca(placa).orElse(new Veiculo());
		v.setPlaca(placa);
		v.setNomeProprietario(c.getNome());
		v.setNomeVeiculo("Mensalista - " + c.getNome());
		veiculoRepo.save(v);
	}

	public Map<String, Object> buscarPorCpf(String cpf) {
		return listarMensalistasSincronizados().stream()
			.filter(m -> m.get("cpf").equals(cpf))
			.findFirst()
			.orElseThrow();
	}

	@Transactional
	public void removerPlano(String cpf) {
		clienteRepo.findById(cpf).ifPresent(c -> {
			c.setTipoPlano(null);
			clienteRepo.save(c);
		});
	}
}
