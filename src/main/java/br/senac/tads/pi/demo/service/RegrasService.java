package br.senac.tads.pi.demo.service;

import br.senac.tads.pi.demo.model.Regras;
import br.senac.tads.pi.demo.repository.RegrasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegrasService {

	@Autowired
	private RegrasRepository repo;

	public Regras getRegras() {
		return repo.findById(1L).orElse(new Regras());
	}

	public Regras salvar(Regras novasRegras) {
		novasRegras.setId(1L);
		return repo.save(novasRegras);
	}
}
