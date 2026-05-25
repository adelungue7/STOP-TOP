package br.senac.tads.pi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.senac.tads.pi.demo.model.Veiculo;
import java.util.Optional;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    
    // Verifica a existência de um veículo pela placa
    boolean existsByPlaca(String placa);
    
    // Busca os dados de um veículo usando a placa
    Optional<Veiculo> findByPlaca(String placa);

    // Novo método para buscar veículo pelo nome do dono
    Optional<Veiculo> findByNomeProprietarioIgnoreCase(String nomeProprietario);
}