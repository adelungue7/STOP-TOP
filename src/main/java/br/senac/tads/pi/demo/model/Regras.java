package br.senac.tads.pi.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "regras_estacionamento")
public class Regras {

	@Id
	private Long id = 1L;

	private Integer tempoTolerancia;
	private Double valorPrimeiraHora;
	private Double valorDemaisHoras;
	private Double valorDiario;
	private Double valorMensal;
	private Double valorTrimestral;
	private Double valorSemestral;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Integer getTempoTolerancia() { return tempoTolerancia; }
	public void setTempoTolerancia(Integer tempoTolerancia) { this.tempoTolerancia = tempoTolerancia; }

	public Double getValorPrimeiraHora() { return valorPrimeiraHora; }
	public void setValorPrimeiraHora(Double valorPrimeiraHora) { this.valorPrimeiraHora = valorPrimeiraHora; }

	public Double getValorDemaisHoras() { return valorDemaisHoras; }
	public void setValorDemaisHoras(Double valorDemaisHoras) { this.valorDemaisHoras = valorDemaisHoras; }

	public Double getValorDiario() { return valorDiario; }
	public void setValorDiario(Double valorDiario) { this.valorDiario = valorDiario; }

	public Double getValorMensal() { return valorMensal; }
	public void setValorMensal(Double valorMensal) { this.valorMensal = valorMensal; }

	public Double getValorTrimestral() { return valorTrimestral; }
	public void setValorTrimestral(Double valorTrimestral) { this.valorTrimestral = valorTrimestral; }

	public Double getValorSemestral() { return valorSemestral; }
	public void setValorSemestral(Double valorSemestral) { this.valorSemestral = valorSemestral; }
}