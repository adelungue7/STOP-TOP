package br.senac.tads.pi.demo.service;

import java.util.List;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.repository.ClienteRepository;

public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente criarCliente(Cliente cliente) {
        return repository.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Cliente buscarPorCpf(String cpf) {
        return repository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + cpf));
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
