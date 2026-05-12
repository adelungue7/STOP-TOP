package br.senac.tads.pi.demo.model;

public class PermanenciaResponse {
    private String tempoTotalFormatado;
    private double valorTotalPago;

    // Getters e Setters
    public String getTempoTotalFormatado() { return tempoTotalFormatado; }
    public void setTempoTotalFormatado(String tempoTotalFormatado) { this.tempoTotalFormatado = tempoTotalFormatado; }
    
    public double getValorTotalPago() { return valorTotalPago; }
    public void setValorTotalPago(double valorTotalPago) { this.valorTotalPago = valorTotalPago; }
}