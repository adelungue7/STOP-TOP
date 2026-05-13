package br.senac.tads.pi.demo.service;

import br.senac.tads.pi.demo.model.Cliente;
import br.senac.tads.pi.demo.model.Veiculo;
import br.senac.tads.pi.demo.repository.ClienteRepository;
import br.senac.tads.pi.demo.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class GestaoService {

    @Autowired 
    private ClienteRepository clienteRepo;
    
    @Autowired 
    private VeiculoRepository veiculoRepo;

    @Transactional
    public Cliente processarNovoMensalista(Cliente cliente) {
        LocalDate inicio = cliente.getDataInicio() != null ? cliente.getDataInicio() : LocalDate.now();
        cliente.setDataNascimento(inicio);
        
        if(cliente.getTipoPlano() != null && "MENSAL".equals(cliente.getTipoPlano().name())) {
            cliente.setDataNascimento(inicio.plusDays(30));
        }
        
        clienteRepo.save(cliente);

        if(cliente.getPlacaPrincipal() != null && !cliente.getPlacaPrincipal().isEmpty()) {
            Veiculo v = new Veiculo();
            v.setPlaca(cliente.getPlacaPrincipal());
            veiculoRepo.save(v);
        }
        
        return cliente;
    }
}