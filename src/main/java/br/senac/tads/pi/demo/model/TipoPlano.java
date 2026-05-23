package br.senac.tads.pi.demo.model;

public enum TipoPlano {
    AVULSO("Avulso"),
    DIARIO("Diário"),
    MENSAL("Mensal"),
    TRIMESTRAL("Trimestral"),
    SEMESTRAL("Semestral");

    private final String descricao;

    private TipoPlano(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

}