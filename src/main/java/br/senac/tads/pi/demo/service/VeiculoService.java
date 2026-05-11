package br.senac.tads.pi.demo.service;

import java.util.List;
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

    // Criar novo veículo
    public Veiculo criarVeiculo(Veiculo veiculo) {
        validarRegras(veiculo, null);
        return veiculoRepository.save(veiculo);
    }

    // Listar todos os veículos
    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    // Buscar veículo por ID
    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado: " + id));
    }

    // Atualizar veículo
    public Veiculo atualizar(Long id, Veiculo dadosNovos) {
        Veiculo existente = buscarPorId(id);
        
        validarRegras(dadosNovos, id);

        existente.setNomeVeiculo(dadosNovos.getNomeVeiculo());
        existente.setNomeProprietario(dadosNovos.getNomeProprietario());
        existente.setPlaca(dadosNovos.getPlaca());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setImagemVeiculo(dadosNovos.getImagemVeiculo());
        
        return veiculoRepository.save(existente);
    }

    // Deletar veículo
    public void deletar(Long id) {
        veiculoRepository.deleteById(id);
    }

    // Validações de negócio centralizadas
    private void validarRegras(Veiculo veiculo, Long idIgnorado) {
        // Validação: Proprietário precisa existir na base de clientes
        if (!clienteRepository.existsByNome(veiculo.getNomeProprietario())) {
            throw new RuntimeException("Proprietário não encontrado. O cliente deve estar cadastrado no sistema.");
        }

        // Validação: Placa não pode ser duplicada no banco
        veiculoRepository.findByPlaca(veiculo.getPlaca()).ifPresent(vEncontrado -> {
            // Se for atualização, ignora a placa do próprio veículo que está sendo editado
            if (idIgnorado == null || !vEncontrado.getId().equals(idIgnorado)) {
                throw new RuntimeException("Já existe um veículo cadastrado com a placa: " + veiculo.getPlaca());
            }
        });
    }
}