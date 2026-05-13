package br.senac.tads.pi.demo.service;

import org.springframework.stereotype.Service;
import br.senac.tads.pi.demo.model.PermanenciaRequest;
import br.senac.tads.pi.demo.model.PermanenciaResponse;
import java.time.Duration;

@Service
public class PermanenciaService {

    public PermanenciaResponse calcular(PermanenciaRequest request) {
        // Calcula a duração total entre a entrada e a saída
        Duration duracao = Duration.between(request.getHoraEntrada(), request.getHoraSaida());
        long minutosTotais = duracao.toMinutes();

        double valorAPagar = 0.0;

        // Se o tempo exceder a tolerância (carência), calcula o valor
        if (minutosTotais > request.getCarenciaMinutos()) {
            double horasFracionadas = (double) minutosTotais / 60.0;
            valorAPagar = horasFracionadas * request.getValorHora();
        }

        // Formata o texto do tempo (ex: 2h 30m)
        long horas = minutosTotais / 60;
        long minutosRestantes = minutosTotais % 60;
        String tempoStr = horas + "h " + minutosRestantes + "m";

        // Constrói a resposta
        PermanenciaResponse response = new PermanenciaResponse();
        response.setTempoTotalFormatado(tempoStr);
        response.setValorTotalPago(valorAPagar);

        return response;
    }
}