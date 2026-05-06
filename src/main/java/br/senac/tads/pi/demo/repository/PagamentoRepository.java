package br.senac.tads.pi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.senac.tads.pi.demo.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}
