package br.senac.tads.pi.demo.repository;

import br.senac.tads.pi.demo.model.Regras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegrasRepository extends JpaRepository<Regras, Long> {
}
