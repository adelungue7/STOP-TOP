document.addEventListener('DOMContentLoaded', () => {
    
    const formCalculo = document.getElementById('formCalculo');

    if (formCalculo) {
        formCalculo.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita recarregar a página

            // 1. Recolher os dados do formulário
            const requestData = {
                placaVeiculo: document.getElementById('placaVeiculo').value,
                valorHora: parseFloat(document.getElementById('valorHora').value),
                horaEntrada: document.getElementById('horaEntrada').value, 
                horaSaida: document.getElementById('horaSaida').value,
                carenciaMinutos: parseInt(document.getElementById('carenciaMinutos').value)
            };

            // 2. Fazer o Fetch (POST) para o Controller Spring Boot
            fetch('/permanencias/calcular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao processar o cálculo.');
                }
                return response.json();
            })
            .then(data => {
                // 3. Atualizar a interface com os resultados
                document.getElementById('lblTempoTotal').textContent = data.tempoTotalFormatado;
                
                // Formatar o valor para Reais (R$)
                const valorFormatado = data.valorTotalPago.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                });
                
                document.getElementById('lblValorTotal').textContent = valorFormatado;
                
                // Mostrar a caixa com o resultado escuro
                document.getElementById('painelResultado').style.display = 'block';
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro na comunicação com o servidor.');
            });
        });
    }
});