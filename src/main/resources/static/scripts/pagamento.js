let regrasAtuais = null;
let clienteAtual = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarRegras();
    configurarBuscaPlaca();
    configurarCalculoAutomatico();
    configurarFormulario();
});

function carregarRegras() {
    fetch('/api/regras')
        .then(res => res.json())
        .then(data => {
            regrasAtuais = data;
            console.log('Regras carregadas:', regrasAtuais);
        })
        .catch(err => console.error('Erro ao carregar regras:', err));
}

function configurarBuscaPlaca() {
    const placaInput = document.getElementById('placaVeiculo');
    placaInput.addEventListener('blur', () => {
        const placa = placaInput.value.trim();
        if (placa) {
            fetch(`/veiculos/placa/${placa}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Veículo não encontrado');
                })
                .then(veiculo => {
                    document.getElementById('veiculo').value = veiculo.nomeVeiculo;
                    document.getElementById('nomeProprietario').value = veiculo.nomeProprietario;
                    buscarDadosCliente(veiculo.nomeProprietario, placa);
                })
                .catch(err => {
                    console.warn(err.message);
                    document.getElementById('veiculo').value = '';
                    document.getElementById('nomeProprietario').value = '';
                    clienteAtual = null;
                    document.getElementById('infoPlano').innerText = 'Veículo não cadastrado. Tarifação Avulsa.';
                    calcularTotal();
                });
        }
    });
}

function buscarDadosCliente(nome, placa) {
    fetch('/api/gestao/mensalistas')
        .then(res => res.json())
        .then(clientes => {
            // Busca por placa primeiro, depois por nome
            clienteAtual = clientes.find(c => c.placa === placa) || clientes.find(c => c.nome === nome);
            if (clienteAtual) {
                document.getElementById('infoPlano').innerText = `Cliente: ${clienteAtual.nome} | Plano: ${clienteAtual.tipoPlano}`;
            } else {
                document.getElementById('infoPlano').innerText = 'Cliente sem plano ativo. Tarifação Avulsa.';
            }
            calcularTotal();
        })
        .catch(err => console.error('Erro ao buscar cliente:', err));
}

function configurarCalculoAutomatico() {
    const inputs = ['entrada', 'saida'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', calcularTotal);
    });
}

function calcularTotal() {
    const entrada = document.getElementById('entrada').value;
    const saida = document.getElementById('saida').value;

    if (!entrada || !saida || !regrasAtuais) return;

    const dataEntrada = new Date(entrada);
    const dataSaida = new Date(saida);

    if (dataSaida <= dataEntrada) {
        document.getElementById('totalDisplay').innerText = 'R$ 0,00';
        return;
    }

    const diffMs = dataSaida - dataEntrada;
    const diffMin = Math.floor(diffMs / 60000);
    const tempoTolerancia = regrasAtuais.tempoTolerancia || 0;

    let total = 0;

    if (clienteAtual && (clienteAtual.tipoPlano === 'MENSAL' || clienteAtual.tipoPlano === 'TRIMESTRAL' || clienteAtual.tipoPlano === 'SEMESTRAL')) {
        total = 0;
        document.getElementById('infoPlano').innerText = `Cliente: ${clienteAtual.nome} | Plano: ${clienteAtual.tipoPlano} (Valor incluso no plano)`;
    } else if (clienteAtual && clienteAtual.tipoPlano === 'DIARIO') {
        total = regrasAtuais.valorDiario || 0;
        document.getElementById('infoPlano').innerText = `Cliente: ${clienteAtual.nome} | Plano: DIARIO (Valor fixo)`;
    } else {
        if (diffMin <= tempoTolerancia) {
            total = 0;
            document.getElementById('infoPlano').innerText = 'Tempo dentro da tolerância.';
        } else {
            const horasTotais = Math.ceil(diffMin / 60);
            if (horasTotais > 0) {
                // Primeira hora
                total = regrasAtuais.valorPrimeiraHora || 0;
                // Demais horas
                if (horasTotais > 1) {
                    total += (horasTotais - 1) * (regrasAtuais.valorDemaisHoras || 0);
                }
            }
        }
    }

    document.getElementById('totalDisplay').innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('btnFinalizar').innerText = `FINALIZAR PAGAMENTO (R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`;
}

function configurarFormulario() {
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const payload = {
            placaVeiculo: document.getElementById('placaVeiculo').value,
            veiculo: document.getElementById('veiculo').value,
            nomeProprietario: document.getElementById('nomeProprietario').value,
            entrada: document.getElementById('entrada').value,
            saida: document.getElementById('saida').value,
            valorTotal: document.getElementById('totalDisplay').innerText.replace('R$ ', '').replace(/\./g, '').replace(',', '.'),
            metodoPagamento: document.querySelector('input[name="metodo"]:checked').value
        };

        fetch('/pagamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) {
                alert('Pagamento finalizado com sucesso!');
                location.reload();
            } else {
                alert('Erro ao processar pagamento.');
            }
        })
        .catch(err => console.error('Erro:', err));
    });
}
