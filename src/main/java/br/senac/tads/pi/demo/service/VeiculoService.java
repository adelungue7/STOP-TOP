package br.senac.tads.pi.demo.service;
 
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import br.senac.tads.pi.demo.model.Veiculo;
import br.senac.tads.pi.demo.repository.ClienteRepository;
import br.senac.tads.pi.demo.repository.VeiculoRepository;
 
@Service
public class VeiculoService {
 
    private final VeiculoRepository veiculoRepository;
    private final ClienteRepository clienteRepository;
 
    public VeiculoService(VeiculoRepository veiculoRepository, ClienteRepository clienteRepository) {
        this.veiculoRepository = veiculoRepository;
        this.clienteRepository = clienteRepository;
    }
 
    // Retorna true se o cliente existir
    public boolean proprietarioExiste(String nomeProprietario) {
        return clienteRepository.existsByNome(nomeProprietario);
    }
 
    // Retorna true se a placa existir (e ignora se for a placa do próprio veículo sendo editado)
    public boolean placaJaCadastrada(String placa, Long idIgnorado) {
        Optional<Veiculo> vEncontrado = veiculoRepository.findByPlaca(placa);
       
        if (vEncontrado.isPresent()) {
            // Se encontrou a placa, mas é o mesmo ID que está sendo atualizado, permite
            if (idIgnorado != null && vEncontrado.get().getId().equals(idIgnorado)) {
                return false;
            }
            return true; // A placa pertence a outro veículo
        }
        return false;
    }
 
    public Veiculo criarVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }
 
    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }
 
    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado: " + id));
    }
 
    public Veiculo atualizar(Long id, Veiculo dadosNovos) {
        Veiculo existente = buscarPorId(id);
       
        existente.setNomeVeiculo(dadosNovos.getNomeVeiculo());
        existente.setNomeProprietario(dadosNovos.getNomeProprietario());
        existente.setPlaca(dadosNovos.getPlaca());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setVaga(dadosNovos.getVaga()); // Mantém a atualização da vaga
       
        return veiculoRepository.save(existente);
    }
 
    public void deletar(Long id) {
        veiculoRepository.deleteById(id);
    }
}