package br.senac.tads.pi.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.repository.ClienteRepository;
import br.senac.tads.pi.demo.repository.VeiculoRepository;

@Service
public class ClienteService {

    private final ClienteRepository repository;
    private final VeiculoRepository veiculoRepository; // Injetado repositório de veículos

    public ClienteService(ClienteRepository repository, VeiculoRepository veiculoRepository) {
        this.repository = repository;
        this.veiculoRepository = veiculoRepository;
    }

    public Cliente criarCliente(Cliente cliente) {
        return repository.save(cliente);
    }

    // FIX: Ao listar todos, ele procura no banco o veículo de cada pessoa e atrela a placa
    public List<Cliente> listarTodos() {
        List<Cliente> clientes = repository.findAll();
        for (Cliente c : clientes) {
            veiculoRepository.findByNomeProprietarioIgnoreCase(c.getNome())
                .ifPresent(v -> c.setPlaca(v.getPlaca()));
        }
        return clientes;
    }

    // FIX: Ao buscar um, ele também puxa a placa
    public Cliente buscarPorCpf(String cpf) {
        Cliente c = repository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + cpf));
                
        veiculoRepository.findByNomeProprietarioIgnoreCase(c.getNome())
                .ifPresent(v -> c.setPlaca(v.getPlaca()));
                
        return c;
    }

    public Cliente atualizar(String cpf, Cliente dadosNovos) {
        Cliente existente = buscarPorCpf(cpf);
        existente.setNome(dadosNovos.getNome());
        existente.setEmail(dadosNovos.getEmail());
        existente.setTelefone(dadosNovos.getTelefone());
        existente.setEndereco(dadosNovos.getEndereco());
        existente.setDataNascimento(dadosNovos.getDataNascimento());
        existente.setTipoPlano(dadosNovos.getTipoPlano());
        return repository.save(existente);
    }

    public void deletar(String cpf) {
        repository.deleteById(cpf);
    }
}