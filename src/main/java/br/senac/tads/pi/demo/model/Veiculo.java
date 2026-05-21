package br.senac.tads.pi.demo.model;
 
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
 
@Entity
@Table(name = "veiculos")
public class Veiculo {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String nomeVeiculo;
    private String nomeProprietario;
    private String placa;
    private String descricao;
    private String vaga; // Mantido o sistema de vagas
 
    // Getters e Setters
    public Long getId() {
        return id;
    }
 
    public void setId(Long id) {
        this.id = id;
    }
 
    public String getNomeVeiculo() {
        return nomeVeiculo;
    }
   
    public void setNomeVeiculo(String nomeVeiculo) {
         this.nomeVeiculo = nomeVeiculo;
    }
 
    public String getNomeProprietario() {
        return nomeProprietario;
    }
   
    public void setNomeProprietario(String nomeProprietario) {
        this.nomeProprietario = nomeProprietario;
    }
 
    public String getPlaca() {
        return placa;
    }
 
    public void setPlaca(String placa) {
         this.placa = placa;
    }
 
    public String getDescricao() {
         return descricao;
    }
 
    public void setDescricao(String descricao) {
         this.descricao = descricao;
    }
 
    public String getVaga() {
         return vaga;
    }
 
    public void setVaga(String vaga) {
        this.vaga = vaga;
    }
}