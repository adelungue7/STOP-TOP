document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const entradaInput = document.getElementById('entrada');
    const saidaInput = document.getElementById('saida');
    const valorHoraInput = document.getElementById('valorHora');
    const totalDisplay = document.getElementById('totalDisplay');
    const btnFinalizar = document.getElementById('btnFinalizar');

    function calcularTotal() {
        const entrada = new Date(entradaInput.value);
        const saida = new Date(saidaInput.value);
        const valorHora = parseFloat(valorHoraInput.value) || 0;

        if (entrada && saida && saida > entrada) {
            const diffMs = saida - entrada;
            const diffHoras = diffMs / (1000 * 60 * 60);
            const total = diffHoras * valorHora;
            
            const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            totalDisplay.textContent = totalFormatado;
            btnFinalizar.textContent = `FINALIZAR PAGAMENTO (${totalFormatado})`;
            return total;
        } else {
            totalDisplay.textContent = 'R$ 0,00';
            btnFinalizar.textContent = 'FINALIZAR PAGAMENTO (R$ 0,00)';
            return 0;
        }
    }

    [entradaInput, saidaInput, valorHoraInput].forEach(input => {
        input.addEventListener('change', calcularTotal);
        input.addEventListener('input', calcularTotal);
    });

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const total = calcularTotal();
        
        const formData = {
            placaVeiculo: document.getElementById('placaVeiculo').value,
            veiculo: document.getElementById('veiculo').value,
            nomeProprietario: document.getElementById('nomeProprietario').value,
            entrada: entradaInput.value,
            saida: saidaInput.value,
            valorHora: parseFloat(valorHoraInput.value),
            valorTotal: total,
            metodoPagamento: document.querySelector('input[name="metodo"]:checked').value
        };

        fetch('/pagamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('Pagamento realizado com sucesso!');
                window.location.href = 'index.html';
            } else {
                alert('Erro ao processar pagamento.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro de conexão com o servidor.');
        });
    });

    // Lógica visual para os radio buttons
    const radios = document.querySelectorAll('input[name="metodo"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.method-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            if (this.checked) {
                this.closest('.method-option').classList.add('active');
            }
        });
    });
});
