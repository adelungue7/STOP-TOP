package br.senac.tads.pi.demo.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat; // Importe isso!

public class PermanenciaRequest {
    private String placaVeiculo;
    private double valorHora;
    
    // Adicione esta anotação para o Java entender o HTML
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime horaEntrada;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime horaSaida;
    
    private int carenciaMinutos;

    // ... (mantenha os Getters e Setters exatamente como estavam)
    public String getPlacaVeiculo() { return placaVeiculo; }
    public void setPlacaVeiculo(String placaVeiculo) { this.placaVeiculo = placaVeiculo; }
    public double getValorHora() { return valorHora; }
    public void setValorHora(double valorHora) { this.valorHora = valorHora; }
    public LocalDateTime getHoraEntrada() { return horaEntrada; }
    public void setHoraEntrada(LocalDateTime horaEntrada) { this.horaEntrada = horaEntrada; }
    public LocalDateTime getHoraSaida() { return horaSaida; }
    public void setHoraSaida(LocalDateTime horaSaida) { this.horaSaida = horaSaida; }
    public int getCarenciaMinutos() { return carenciaMinutos; }
    public void setCarenciaMinutos(int carenciaMinutos) { this.carenciaMinutos = carenciaMinutos; }
}