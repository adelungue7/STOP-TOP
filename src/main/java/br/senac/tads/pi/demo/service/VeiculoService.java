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
 
    public boolean proprietarioExiste(String nomeProprietario) {
        return clienteRepository.existsByNome(nomeProprietario);
    }
 
    public boolean placaJaCadastrada(String placa, Long idIgnorado) {
        Optional<Veiculo> vEncontrado = veiculoRepository.findByPlaca(placa);
       
        if (vEncontrado.isPresent()) {
            if (idIgnorado != null && vEncontrado.get().getId().equals(idIgnorado)) {
                return false;
            }
            return true;
        }
        return false;
    }

    public boolean vagaJaOcupada(String vaga, Long idIgnorado) {
        if (vaga == null || vaga.trim().isEmpty()) {
            return false; 
        }
        
        Optional<Veiculo> vEncontrado = veiculoRepository.findByVagaIgnoreCase(vaga.trim());
        
        if (vEncontrado.isPresent()) {
            if (idIgnorado != null && vEncontrado.get().getId().equals(idIgnorado)) {
                return false;
            }
            return true; 
        }
        return false;
    }

    // ✅ NOVO MÉTODO: Bloqueia mais de um veículo para o mesmo proprietário
    public boolean clienteJaPossuiVeiculo(String nomeProprietario, Long idIgnorado) {
        if (nomeProprietario == null || nomeProprietario.trim().isEmpty()) {
            return false;
        }
        
        Optional<Veiculo> vEncontrado = veiculoRepository.findByNomeProprietarioIgnoreCase(nomeProprietario.trim());
        
        if (vEncontrado.isPresent()) {
            // Se o usuário estiver apenas editando/atualizando o carro que já é dele, permite passar.
            if (idIgnorado != null && vEncontrado.get().getId().equals(idIgnorado)) {
                return false;
            }
            // Se for um ID diferente ou um cadastro novo, avisa que ele já tem carro.
            return true; 
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

    public Optional<Veiculo> buscarPorPlaca(String placa) {
        return veiculoRepository.findByPlaca(placa);
    }
 
    public Veiculo atualizar(Long id, Veiculo dadosNovos) {
        Veiculo existente = buscarPorId(id);
       
        existente.setNomeVeiculo(dadosNovos.getNomeVeiculo());
        existente.setNomeProprietario(dadosNovos.getNomeProprietario());
        existente.setPlaca(dadosNovos.getPlaca());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setVaga(dadosNovos.getVaga()); 
       
        return veiculoRepository.save(existente);
    }
 
    public void deletar(Long id) {
        veiculoRepository.deleteById(id);
    }
}