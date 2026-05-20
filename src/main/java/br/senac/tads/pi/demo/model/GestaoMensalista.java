package br.senac.tads.pi.demo.model;

import java.time.LocalDate;

public class GestaoMensalista {

	private String nome;
	private String cpf;
	private String email;
	private String telefone;
	private String endereco;
	private String placaPrincipal;
	private String placaSecundaria;
	private String tipoPlano;
	private LocalDate dataInicio;

	public String getNome() { return nome; }
	public void setNome(String nome) { this.nome = nome; }

	public String getCpf() { return cpf; }
	public void setCpf(String cpf) { this.cpf = cpf; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getTelefone() { return telefone; }
	public void setTelefone(String telefone) { this.telefone = telefone; }

	public String getEndereco() { return endereco; }
	public void setEndereco(String endereco) { this.endereco = endereco; }

	public String getPlacaPrincipal() { return placaPrincipal; }
	public void setPlacaPrincipal(String placaPrincipal) { this.placaPrincipal = placaPrincipal; }

	public String getPlacaSecundaria() { return placaSecundaria; }
	public void setPlacaSecundaria(String placaSecundaria) { this.placaSecundaria = placaSecundaria; }

	public String getTipoPlano() { return tipoPlano; }
	public void setTipoPlano(String tipoPlano) { this.tipoPlano = tipoPlano; }

	public LocalDate getDataInicio() { return dataInicio; }
	public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
}
