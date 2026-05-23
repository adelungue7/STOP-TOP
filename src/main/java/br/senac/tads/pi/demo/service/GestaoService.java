package br.senac.tads.pi.demo.service;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.model.TipoPlano;
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
            .filter(c -> c.getTipoPlano() != null)
            .map(c -> {
                var veiculo = veiculoRepo.findAll().stream()
                    .filter(v -> v.getNomeProprietario() != null && v.getNomeProprietario().equalsIgnoreCase(c.getNome()))
                    .findFirst();

                String placa = veiculo.isPresent() ? veiculo.get().getPlaca() : "N/A";

                return Map.<String, Object>of(
                    "cpf", c.getCpf(),
                    "nome", c.getNome(),
                    "email", c.getEmail(),
                    "telefone", c.getTelefone(),
                    "endereco", c.getEndereco() != null ? c.getEndereco() : "",
                    "tipoPlano", c.getTipoPlano().name(),
                    "dataInicio", c.getDataNascimento() != null ? c.getDataNascimento().toString() : "",
                    "vencimento", calcularVencimento(c.getDataNascimento(), c.getTipoPlano()),
                    "placa", placa
                );
            })
            .collect(Collectors.toList());
    }

    private String calcularVencimento(LocalDate inicio, TipoPlano plano) {
        if (inicio == null || plano == null) return "N/A";
        LocalDate fim = inicio;
        if (plano == TipoPlano.AVULSO) fim = inicio;
        else if (plano == TipoPlano.DIARIO) fim = inicio.plusDays(1);
        else if (plano == TipoPlano.MENSAL) fim = inicio.plusMonths(1);
        else if (plano == TipoPlano.TRIMESTRAL) fim = inicio.plusMonths(3);
        else if (plano == TipoPlano.SEMESTRAL) fim = inicio.plusMonths(6);
        return fim.toString();
    }

    @Transactional
    public void salvarOuAtualizar(String cpf, String placa, String tipoPlano, String dataInicio) {
        Cliente c = clienteRepo.findById(cpf).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        c.setTipoPlano(TipoPlano.valueOf(tipoPlano));
        c.setDataNascimento(LocalDate.parse(dataInicio));
        clienteRepo.save(c);

        Veiculo v = veiculoRepo.findByPlaca(placa).orElse(new Veiculo());
        v.setPlaca(placa);
        v.setNomeProprietario(c.getNome());
        if (v.getNomeVeiculo() == null) v.setNomeVeiculo("Veículo de Assinante");
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
