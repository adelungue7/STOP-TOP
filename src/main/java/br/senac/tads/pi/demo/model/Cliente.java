package br.senac.tads.pi.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Transient;
import java.time.LocalDate;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    private String cpf;
    private String nome;
    private String email;
    private LocalDate dataNascimento;
    private String telefone;
    private String endereco;
    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoPlano tipoPlano;

    @Transient
    private String placaPrincipal;
    
    @Transient
    private String placaSecundaria;
    
    @Transient
    private LocalDate dataInicio;

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public TipoPlano getTipoPlano() { return tipoPlano; }
    public void setTipoPlano(TipoPlano tipoPlano) { this.tipoPlano = tipoPlano; }

    public String getPlacaPrincipal() { return placaPrincipal; }
    public void setPlacaPrincipal(String placaPrincipal) { this.placaPrincipal = placaPrincipal; }

    public String getPlacaSecundaria() { return placaSecundaria; }
    public void setPlacaSecundaria(String placaSecundaria) { this.placaSecundaria = placaSecundaria; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
}