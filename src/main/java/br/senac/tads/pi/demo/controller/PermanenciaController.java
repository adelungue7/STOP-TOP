package br.senac.tads.pi.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.senac.tads.pi.demo.model.PermanenciaRequest;
import br.senac.tads.pi.demo.model.PermanenciaResponse;
import br.senac.tads.pi.demo.service.PermanenciaService;

@RestController
@RequestMapping("/permanencias")
public class PermanenciaController {

    private final PermanenciaService service;

    // Injeção de dependência igual ao ClienteController
    public PermanenciaController(PermanenciaService service) {
        this.service = service;
    }

    @PostMapping("/calcular")
    public ResponseEntity<PermanenciaResponse> calcularPermanencia(@RequestBody PermanenciaRequest request) {
        PermanenciaResponse resultado = service.calcular(request);
        return ResponseEntity.ok(resultado);
    }
}