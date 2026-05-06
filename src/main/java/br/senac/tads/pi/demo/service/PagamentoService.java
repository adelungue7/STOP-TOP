package br.senac.tads.pi.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.senac.tads.pi.demo.model.Pagamento;
import br.senac.tads.pi.demo.repository.PagamentoRepository;

@Service
public class PagamentoService {

    private final PagamentoRepository repository;

    public PagamentoService(PagamentoRepository repository) {
        this.repository = repository;
    }

    public Pagamento realizarPagamento(Pagamento pagamento) {
        return repository.save(pagamento);
    }

    public List<Pagamento> listarTodos() {
        return repository.findAll();
    }
}
