package br.senac.tads.pi.demo.model;

public enum TipoPlano {
    DIARIO("Diário"),
    MENSAL("Mensal");

    private final String descricao;

    private TipoPlano(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }


}
