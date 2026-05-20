package br.senac.tads.pi.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "regras_estacionamento")
public class Regras {

	@Id
	private Long id = 1L;

	private Double valorPrimeiraHora;
	private Double valorHoraAdicional;
	private Integer tempoTolerancia;
	private Double taxaEspecial;
	private Integer duracaoReserva;
	private Integer vagasReservaPercentual;
	private Integer permanenciaMaxima;
	private Integer diasNotificacaoRenovar;
	private Double descontoAntecipado;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Double getValorPrimeiraHora() { return valorPrimeiraHora; }
	public void setValorPrimeiraHora(Double valorPrimeiraHora) { this.valorPrimeiraHora = valorPrimeiraHora; }

	public Double getValorHoraAdicional() { return valorHoraAdicional; }
	public void setValorHoraAdicional(Double valorHoraAdicional) { this.valorHoraAdicional = valorHoraAdicional; }

	public Integer getTempoTolerancia() { return tempoTolerancia; }
	public void setTempoTolerancia(Integer tempoTolerancia) { this.tempoTolerancia = tempoTolerancia; }

	public Double getTaxaEspecial() { return taxaEspecial; }
	public void setTaxaEspecial(Double taxaEspecial) { this.taxaEspecial = taxaEspecial; }

	public Integer getDuracaoReserva() { return duracaoReserva; }
	public void setDuracaoReserva(Integer duracaoReserva) { this.duracaoReserva = duracaoReserva; }

	public Integer getVagasReservaPercentual() { return vagasReservaPercentual; }
	public void setVagasReservaPercentual(Integer vagasReservaPercentual) { this.vagasReservaPercentual = vagasReservaPercentual; }

	public Integer getPermanenciaMaxima() { return permanenciaMaxima; }
	public void setPermanenciaMaxima(Integer permanenciaMaxima) { this.permanenciaMaxima = permanenciaMaxima; }

	public Integer getDiasNotificacaoRenovar() { return diasNotificacaoRenovar; }
	public void setDiasNotificacaoRenovar(Integer diasNotificacaoRenovar) { this.diasNotificacaoRenovar = diasNotificacaoRenovar; }

	public Double getDescontoAntecipado() { return descontoAntecipado; }
	public void setDescontoAntecipado(Double descontoAntecipado) { this.descontoAntecipado = descontoAntecipado; }
}
